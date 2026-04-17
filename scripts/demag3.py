#!/usr/bin/env python3
"""Third-pass cleanup: fix remaining visible lowercase strings in JSX children and labels."""
from pathlib import Path

FILES = [
    "src/components/dashboard/AccountSettingsPage.jsx",
    "src/components/dashboard/AdsPage.jsx",
    "src/components/dashboard/AgentSettingsPage.jsx",
    "src/components/dashboard/HomePage.jsx",
    "src/components/dashboard/InboxDetailDrawer.jsx",
    "src/components/dashboard/NetworkPage.jsx",
    "src/components/dashboard/NotificationsPage.jsx",
    "src/components/dashboard/PaymentsPage.jsx",
    "src/components/dashboard/ProfilePage.jsx",
    "src/components/dashboard/ReferralsPage.jsx",
    "src/components/dashboard/SettingsPage.jsx",
    "src/components/dashboard/SocialOAuthPage.jsx",
    "src/components/dashboard/TajMessageCard.jsx",
    "src/components/dashboard/WorkHistoryPage.jsx",
    "src/components/dashboard/YouPage.jsx",
]

ROOT = Path("/Users/tajsethi/Desktop/gully")

REPLACEMENTS = [
    # Notifications label
    ("<span>notifications</span>", "<span>Notifications</span>"),

    # AccountSettingsPage manage billing
    ("<ExternalLink size={12} /> manage billing", "<ExternalLink size={12} /> Manage billing"),

    # Ads
    ("<WhatsAppIcon size={12} /> set up promotion via taj", "<WhatsAppIcon size={12} /> Set up promotion via Taj"),

    # Network  
    ("<Instagram size={11} /> instagram", "<Instagram size={11} /> Instagram"),
    ("<Linkedin size={11} /> linkedin", "<Linkedin size={11} /> LinkedIn"),
    ('<WhatsAppIcon size={10} color="#25D366" /> ask taj', '<WhatsAppIcon size={10} color="#25D366" /> Ask Taj'),
    ('<Flame size={9} fill="currentColor" /> warm', '<Flame size={9} fill="currentColor" /> Warm'),
    ("<Link2 size={11} /> open linkedin", "<Link2 size={11} /> Open LinkedIn"),

    # Network contact source labels
    ('{ id: "linkedin",  label: "linkedin"', '{ id: "linkedin",  label: "LinkedIn"'),

    # HomePage Taj-voice fixes for common lowercase phrases
    ('"DP"', '"DP"'),  # no-op but intentional
    
    # Payments
    ('<WhatsAppIcon size={12} /> upgrade via taj', '<WhatsAppIcon size={12} /> Upgrade via Taj'),

    # Referrals
    ('<WhatsAppIcon size={13} /> share on whatsapp', '<WhatsAppIcon size={13} /> Share on WhatsApp'),
    ('<Copy size={12} /> copy', '<Copy size={12} /> Copy'),
    ('<Share2 size={12} /> share', '<Share2 size={12} /> Share'),
    
    # Social
    ('<Check size={10} /> verified', '<Check size={10} /> Verified'),
    ('<Check size={10} /> connected', '<Check size={10} /> Connected'),
    
    # Misc button texts
    (">add link<", ">Add link<"),
    (">edit profile<", ">Edit profile<"),
    (">save all links<", ">Save all links<"),
    (">saving…<", ">Saving…<"),
    (">verify<", ">Verify<"),
    (">soon<", ">Soon<"),
    (">verified<", ">Verified<"),
    (">log out<", ">Log out<"),
    (">cancel<", ">Cancel<"),
    (">delete<", ">Delete<"),
    (">deleting…<", ">Deleting…<"),
    (">saved<", ">Saved<"),
    (">active<", ">Active<"),
    (">free<", ">Free<"),
    (">pro<", ">Pro<"),
    (">done<", ">Done<"),

    # Agent settings badge "pro"
    (">pro<", ">Pro<"),
]

def main():
    changed = 0
    for rel in FILES:
        p = ROOT / rel
        if not p.exists():
            continue
        original = p.read_text()
        updated = original
        for old, new in REPLACEMENTS:
            updated = updated.replace(old, new)
        if original != updated:
            p.write_text(updated)
            print(f"UPDATED: {rel}")
            changed += 1
    print(f"\nTotal changed: {changed}")

if __name__ == "__main__":
    main()
