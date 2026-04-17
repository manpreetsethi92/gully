#!/usr/bin/env python3
"""
Dashboard de-magazine-ification.
Applies consistent rules across every dashboard page to strip
editorial typography in favor of a functional app look.
"""
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
    "src/pages/DashboardLayout.jsx",
]

ROOT = Path("/Users/tajsethi/Desktop/gully")

RULES = [
    (r"\bfont-display\b\s*", ""),
    (r"\bfont-syne\b\s*", ""),
    (r"\blowercase\b\s*", ""),
    (r"\bplaceholder:lowercase\b\s*", ""),
    (r"text-\[clamp\(2rem,5vw,44px\)\]", "text-[18px]"),
    (r"text-\[clamp\(2\.25rem,5\.5vw,52px\)\]", "text-[18px]"),
    (r"text-\[clamp\(2rem,4\.5vw,40px\)\]", "text-[18px]"),
    (r"text-\[32px\]", "text-[18px]"),
    (r"text-\[28px\]", "text-[18px]"),
    (r"text-\[26px\]", "text-[18px]"),
    (r"text-\[24px\]", "text-[18px]"),
    (r"text-\[22px\]", "text-[16px]"),
    (r"leading-none\s+font-normal", "font-semibold"),
    (r"leading-tight\s+font-normal", "font-semibold"),
    (r"tracking-\[0\.25em\]\s*", ""),
    (r"tracking-\[0\.2em\]\s*", ""),
    (r"tracking-tight\s*", ""),
]

TEXT_REPLACEMENTS = [
    ('your inbox', 'Inbox'),
    ("here's what taj found.", 'What Taj found'),
    ('your identity', 'Profile'),
    ('fine-tune everything.', 'Settings'),
    ('who are you, really?', 'Edit profile'),
    ('connect socials.', 'Connect socials'),
    ('work history.', 'Work history'),
    ('where else do you live?', 'Add portfolio link'),
    ('edit profile', 'Edit profile'),
    ('how people find you', 'Socials'),
    ('your track record', 'Work'),
]


def transform(text: str) -> str:
    for pattern, replacement in RULES:
        text = re.sub(pattern, replacement, text)

    def collapse_spaces(match):
        content = match.group(0)
        content = re.sub(r'  +', ' ', content)
        content = re.sub(r' "', '"', content)
        content = re.sub(r'" ', '" ', content)
        content = re.sub(r' `', '`', content)
        content = re.sub(r'` ', '`', content)
        return content

    text = re.sub(r'className="[^"]*"', collapse_spaces, text)
    text = re.sub(r'className=\{`[^`]*`\}', collapse_spaces, text)

    for old, new in TEXT_REPLACEMENTS:
        text = text.replace(f'>{old}<', f'>{new}<')
        # also replace inside JSX string expressions like {"text"}
        text = text.replace(f'"{old}"', f'"{new}"')

    return text


def main():
    changed = 0
    for rel in FILES:
        p = ROOT / rel
        if not p.exists():
            print(f"MISSING: {rel}")
            continue
        original = p.read_text()
        updated = transform(original)
        if original != updated:
            p.write_text(updated)
            print(f"UPDATED: {rel}")
            changed += 1
        else:
            print(f"unchanged: {rel}")
    print(f"\nTotal changed: {changed}/{len(FILES)}")


if __name__ == "__main__":
    main()
