/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth, API } from "../../App";
import { CreditCard, MessageCircle, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";

const PaymentsPage = ({ darkMode }) => {
  const { token } = useAuth();
  const [paymentData, setPaymentData] = useState({ escrow: [], earnings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await axios.get(`${API}/graph/gig-dna`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPaymentData(response.data || { escrow: [], earnings: [] });
      } catch {
        setPaymentData({ escrow: [], earnings: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="spinner"></div>
      </div>
    );
  }

  const escrow = paymentData.escrow || [];
  const earnings = paymentData.earnings || [];
  const totalEarned = earnings.reduce((s, e) => s + (e.amount || 0), 0);
  const pendingEscrow = escrow.filter(e => e.status === "held").reduce((s, e) => s + (e.amount || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className={`sticky top-14 lg:top-0 z-40 px-4 py-3 border-b ${darkMode ? "bg-[#0a0a0a] border-white/10" : "bg-white border-gray-100"}`}>
        <h1 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Payments</h1>
      </div>

      {/* Summary Stats */}
      <div className={`px-4 py-4 border-b ${darkMode ? "border-white/10" : "border-gray-100"}`}>
        <div className="grid grid-cols-2 gap-3">
          <div className={`p-4 rounded-2xl ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
            <p className={`text-xs uppercase tracking-wider mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>Total Earned</p>
            <p className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              {totalEarned > 0 ? `$${totalEarned.toLocaleString()}` : "—"}
            </p>
          </div>
          <div className={`p-4 rounded-2xl ${darkMode ? "bg-white/5" : "bg-gray-50"}`}>
            <p className={`text-xs uppercase tracking-wider mb-1 ${darkMode ? "text-white/40" : "text-gray-400"}`}>In Escrow</p>
            <p className={`text-2xl font-bold ${pendingEscrow > 0 ? (darkMode ? "text-yellow-400" : "text-yellow-600") : (darkMode ? "text-white" : "text-gray-900")}`}>
              {pendingEscrow > 0 ? `$${pendingEscrow.toLocaleString()}` : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Coming Soon / Empty */}
      {escrow.length === 0 && earnings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <CreditCard size={48} className={darkMode ? "text-white/20" : "text-gray-300"} />
          <h2 className={`text-2xl font-bold mb-2 mt-4 ${darkMode ? "text-white" : "text-gray-900"}`}>No payments yet</h2>
          <p className={`mb-6 ${darkMode ? "text-white/50" : "text-gray-500"}`}>
            When you close a gig with escrow protection, your earnings will appear here.
          </p>
          <a
            href="https://wa.me/12134147369?text=Hi%20Taj!"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold text-sm"
            style={{ background: "#E50914" }}
          >
            <MessageCircle size={18} />
            Find paid gigs via Taj
          </a>
        </div>
      ) : (
        <div className={`divide-y ${darkMode ? "divide-white/10" : "divide-gray-100"}`}>
          {escrow.map((item, i) => (
            <div key={i} className={`px-4 py-5 ${darkMode ? "hover:bg-white/5" : "hover:bg-gray-50"} transition-colors`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.status === "held" ? (darkMode ? "bg-yellow-500/20" : "bg-yellow-100") : (darkMode ? "bg-green-500/20" : "bg-green-100")}`}>
                  {item.status === "held" ? (
                    <Clock size={18} className={darkMode ? "text-yellow-400" : "text-yellow-600"} />
                  ) : (
                    <ArrowDownLeft size={18} className={darkMode ? "text-green-400" : "text-green-600"} />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{item.description || "Escrow payment"}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === "held" ? (darkMode ? "bg-yellow-500/20 text-yellow-300" : "bg-yellow-100 text-yellow-700") : (darkMode ? "bg-green-500/20 text-green-300" : "bg-green-100 text-green-700")}`}>
                    {item.status === "held" ? "In escrow" : "Released"}
                  </span>
                </div>
                <p className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>${item.amount?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
