#!/usr/bin/env python3
"""Second-pass cleanup: sentence-case remaining lowercase copy strings."""
import re
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

# Sentence-case specific strings that appear in code as data (not JSX children).
# These are copy strings inside {} data structures — title:/body:/label:/description:.
REPLACEMENTS = [
    # YouPage tabs
    ('label: "about"', 'label: "About"'),
    ('label: "socials"', 'label: "Socials"'),

    # AgentSettings toggle labels + descriptions (same data also used in AccountSettingsPage duplicate, now removed)
    ('label: "auto-pitch to hirers", description: "taj reaches out to matching hirers for you, no ask needed"',
     'label: "Auto-pitch to hirers", description: "Taj reaches out to matching hirers for you, no ask needed"'),
    ('label: "auto-negotiate rate", description: "taj handles rate talks within your stated range"',
     'label: "Auto-negotiate rate", description: "Taj handles rate talks within your stated range"'),
    ('label: "auto-confirm bookings", description: "taj accepts gig invites that match your availability"',
     'label: "Auto-confirm bookings", description: "Taj accepts gig invites that match your availability"'),
    ('label: "chase unpaid invoices", description: "taj follows up on late payments from hirers"',
     'label: "Chase unpaid invoices", description: "Taj follows up on late payments from hirers"'),
    ('label: "auto-update work history", description: "taj adds closed gigs to your history automatically"',
     'label: "Auto-update work history", description: "Taj adds closed gigs to your history automatically"'),

    # Referrals stats
    ('label: "clicks"', 'label: "Clicks"'),
    ('label: "signups"', 'label: "Signups"'),
    ('label: "pro months"', 'label: "Pro months"'),

    # HomePage empty states
    ('title: "nothing in the queue yet."', 'title: "Nothing in the queue yet."'),
    ('body: "taj is scanning. when she finds a match, it lands here first."',
     'body: "Taj is scanning. When she finds a match, it lands here first."'),
    ('title: "you haven\'t asked for anything yet."', 'title: "You haven\'t asked for anything yet."'),
    ('body: "text taj what you need — a plumber, a dp, a wedding singer. she\'ll go find them."',
     'body: "Text Taj what you need — a plumber, a DP, a wedding singer. She\'ll go find them."'),
    ('title: "no saved gigs."', 'title: "No saved gigs."'),
    ('body: "when taj shows you external gigs, save the ones you want for later."',
     'body: "When Taj shows you external gigs, save the ones you want for later."'),
    ('title: "nothing closed yet."', 'title: "Nothing closed yet."'),
    ('body: "every gig you finish through gully shows up here. your verified track record."',
     'body: "Every gig you finish through Gully shows up here. Your verified track record."'),
    ('title: "your inbox is empty."', 'title: "Your inbox is empty."'),
    ('body: "give taj a minute. she\'s building your world."',
     'body: "Give Taj a minute. She\'s building your world."'),

    # Misc aria-labels
    ('aria-label="close details"', 'aria-label="Close details"'),
]

def transform(text: str) -> str:
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    return text

def main():
    changed = 0
    for rel in FILES:
        p = ROOT / rel
        if not p.exists():
            continue
        original = p.read_text()
        updated = transform(original)
        if original != updated:
            p.write_text(updated)
            print(f"UPDATED: {rel}")
            changed += 1
    print(f"\nTotal changed: {changed}")

if __name__ == "__main__":
    main()
