/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../App';
import axios from 'axios';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CreditCard, ArrowDown, ArrowUp, Lock, FileText, TrendingUp } from 'lucide-react';

const PaymentsPage = ({ darkMode = false }) => {
  const { token, API } = useAuth();
  const [_payments, setPayments] = useState([]);
  const [escrows, setEscrows] = useState([]);
  const [earnings, setEarnings] = useState({
    total: 0,
    available: 0,
    pending: 0,
    withdrawn: 0
  });
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchPaymentData();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, escrowsRes, earningsRes, historyRes, contractsRes] = await Promise.all([
        axios.get(`${API}/payments`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/escrows`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/earnings`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/payments/history`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/contracts`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setPayments(paymentsRes.data.payments || []);
      setEscrows(escrowsRes.data.escrows || []);
      setEarnings(earningsRes.data.earnings || {
        total: 0,
        available: 0,
        pending: 0,
        withdrawn: 0
      });
      setPaymentHistory(historyRes.data.history || []);
      setContracts(contractsRes.data.contracts || []);
    } catch (err) {
      setError('Failed to fetch payment data');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e, escrowId) => {
    e.preventDefault();
    try {
      setLoading(true);
      const _response = await axios.post(
        `${API}/payments`,
        {
          escrowId,
          method: paymentMethod,
          amount: escrows.find(e => e.id === escrowId)?.amount
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPaymentData();
      setShowPaymentForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async (amount) => {
    try {
      setLoading(true);
      await axios.post(
        `${API}/earnings/withdraw`,
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPaymentData();
    } catch (err) {
      setError(err.response?.data?.message || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  const bgColor = darkMode ? 'bg-slate-900' : 'bg-white';
  const textColor = darkMode ? 'text-slate-100' : 'text-slate-900';
  const cardBg = darkMode ? 'bg-slate-800' : 'bg-slate-50';
  const borderColor = darkMode ? 'border-slate-700' : 'border-slate-200';

  return (
    <div className={`p-6 space-y-6 ${bgColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <h1 className={`text-3xl font-bold ${textColor}`}>Payments & Earnings</h1>
          <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage payments and track your earnings
          </p>
        </div>
        <Button
          onClick={() => setShowPaymentForm(!showPaymentForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Make Payment
        </Button>
      </div>

      {error && (
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-red-900 border-red-700 text-red-100' : 'bg-red-50 border-red-200 text-red-900'}`}>
          {error}
        </div>
      )}

      {/* Earnings Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EarningsCard
          label="Total Earnings"
          amount={`₹${earnings.total?.toLocaleString()}`}
          icon={<TrendingUp className="w-6 h-6" />}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
        />
        <EarningsCard
          label="Available"
          amount={`₹${earnings.available?.toLocaleString()}`}
          icon={<ArrowDown className="w-6 h-6" />}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
          action={() => handleWithdrawal(earnings.available)}
          actionLabel="Withdraw"
        />
        <EarningsCard
          label="Pending"
          amount={`₹${earnings.pending?.toLocaleString()}`}
          icon={<Lock className="w-6 h-6" />}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
        />
        <EarningsCard
          label="Withdrawn"
          amount={`₹${earnings.withdrawn?.toLocaleString()}`}
          icon={<ArrowUp className="w-6 h-6" />}
          darkMode={darkMode}
          cardBg={cardBg}
          textColor={textColor}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full grid-cols-4 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="escrow">Escrow ({escrows.length})</TabsTrigger>
          <TabsTrigger value="contracts">Contracts ({contracts.length})</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {showPaymentForm && (
            <Card className={`p-6 border ${borderColor} ${cardBg}`}>
              <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Make a Payment</h2>
              <form onSubmit={(e) => handlePayment(e, escrows[0]?.id)} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${textColor}`}>
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-300'}`}
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="upi">UPI</option>
                    <option value="wallet">Digital Wallet</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Processing...' : 'Confirm Payment'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowPaymentForm(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <Card className={`p-6 border ${borderColor} ${cardBg}`}>
            <h3 className={`font-bold text-lg mb-4 ${textColor}`}>Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Active Escrows</span>
                <span className={`font-bold ${textColor}`}>{escrows.filter(e => e.status === 'active').length}</span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Completed Transactions</span>
                <span className={`font-bold ${textColor}`}>{paymentHistory.length}</span>
              </div>
              <div className="flex justify-between">
                <span className={darkMode ? 'text-slate-400' : 'text-slate-600'}>Active Contracts</span>
                <span className={`font-bold ${textColor}`}>{contracts.filter(c => c.status === 'active').length}</span>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Escrow Tab */}
        <TabsContent value="escrow" className="space-y-4">
          {escrows.length === 0 ? (
            <Card className={`p-8 text-center ${cardBg} border ${borderColor}`}>
              <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                No active escrows
              </p>
            </Card>
          ) : (
            escrows.map((escrow) => (
              <EscrowCard
                key={escrow.id}
                escrow={escrow}
                onPay={(e) => handlePayment(e, escrow.id)}
                darkMode={darkMode}
                cardBg={cardBg}
                borderColor={borderColor}
                textColor={textColor}
              />
            ))
          )}
        </TabsContent>

        {/* Contracts Tab */}
        <TabsContent value="contracts" className="space-y-4">
          {contracts.length === 0 ? (
            <Card className={`p-8 text-center ${cardBg} border ${borderColor}`}>
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                No contracts yet
              </p>
            </Card>
          ) : (
            contracts.map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                darkMode={darkMode}
                cardBg={cardBg}
                borderColor={borderColor}
                textColor={textColor}
              />
            ))
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          {paymentHistory.length === 0 ? (
            <Card className={`p-8 text-center ${cardBg} border ${borderColor}`}>
              <p className={darkMode ? 'text-slate-400' : 'text-slate-600'}>
                No payment history
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {paymentHistory.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  darkMode={darkMode}
                  borderColor={borderColor}
                  textColor={textColor}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

const EarningsCard = ({
  label,
  amount,
  icon,
  darkMode,
  cardBg,
  textColor,
  action,
  actionLabel
}) => {
  return (
    <Card className={`p-4 border ${darkMode ? 'border-slate-700' : 'border-slate-200'} ${cardBg}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {label}
          </p>
          <p className={`text-2xl font-bold mt-2 ${textColor}`}>{amount}</p>
        </div>
        <div className={`p-2 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
          {icon}
        </div>
      </div>
      {action && (
        <Button
          onClick={action}
          size="sm"
          className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-xs"
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  );
};

const EscrowCard = ({
  escrow,
  onPay,
  darkMode,
  cardBg,
  borderColor,
  textColor
}) => {
  const statusColor = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    released: 'bg-blue-100 text-blue-700',
    disputed: 'bg-red-100 text-red-700'
  }[escrow.status] || 'bg-gray-100 text-gray-700';

  return (
    <Card className={`p-6 border ${borderColor} ${cardBg}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`font-bold ${textColor}`}>{escrow.projectTitle}</h3>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            with {escrow.counterparty}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {escrow.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Amount
          </p>
          <p className={`text-lg font-bold ${textColor}`}>₹{escrow.amount?.toLocaleString()}</p>
        </div>
        <div>
          <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Released
          </p>
          <p className={`text-lg font-bold ${textColor}`}>₹{escrow.releasedAmount?.toLocaleString() || '0'}</p>
        </div>
        <div>
          <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Created
          </p>
          <p className={`text-sm ${textColor}`}>{new Date(escrow.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {escrow.status === 'active' && (
        <Button
          onClick={onPay}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Release Payment
        </Button>
      )}
    </Card>
  );
};

const ContractCard = ({
  contract,
  darkMode,
  cardBg,
  borderColor,
  textColor
}) => {
  return (
    <Card className={`p-6 border ${borderColor} ${cardBg}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className={`font-bold ${textColor}`}>{contract.title}</h3>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {contract.clientName}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          contract.status === 'active'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700'
        }`}>
          {contract.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Value
          </p>
          <p className={`font-bold ${textColor}`}>₹{contract.value?.toLocaleString()}</p>
        </div>
        <div>
          <p className={`text-xs uppercase font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            End Date
          </p>
          <p className={`font-bold ${textColor}`}>{new Date(contract.endDate).toLocaleDateString()}</p>
        </div>
      </div>

      <Button variant="outline" className="w-full">
        <FileText className="w-4 h-4 mr-2" />
        View Contract
      </Button>
    </Card>
  );
};

const TransactionRow = ({
  transaction,
  darkMode,
  borderColor,
  textColor
}) => {
  const isIncoming = transaction.type === 'incoming';

  return (
    <div className={`flex justify-between items-center p-4 rounded-lg border ${borderColor} ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
      <div className="flex-1">
        <p className={`font-medium ${textColor}`}>{transaction.description}</p>
        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          {new Date(transaction.date).toLocaleDateString()}
        </p>
      </div>
      <div className="text-right">
        <p className={`font-bold text-lg ${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
          {isIncoming ? '+' : '-'}₹{transaction.amount?.toLocaleString()}
        </p>
        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          {transaction.status}
        </p>
      </div>
    </div>
  );
};

export default PaymentsPage;
