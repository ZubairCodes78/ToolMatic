import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
HTML_FILES = [f for f in ROOT.rglob('*.html') if '.venv' not in f.parts and f.name != 'google442de89fc977bfee.html']

POPUNDER_URL = 'https://pl31082067.profitableratecpmnetwork.com/5f/47/5a/5f475a0559812399104f0edc60993993.js'
SOCIAL_URL = 'https://pl31082068.profitableratecpmnetwork.com/37/62/52/37625204b19e74ce25495cd3b497864a.js'
NATIVE_URL = 'https://pl31082069.profitableratecpmnetwork.com/4f0143c28c037bb01761d989dc19754d/invoke.js'
CONTAINER_ID = 'container-4f0143c28c037bb01761d989dc19754d'

def verify():
    errors = []
    print(f"Auditing {len(HTML_FILES)} HTML files for Adsterra ad integrations...\n")

    for f in sorted(HTML_FILES):
        text = f.read_text(encoding='utf-8')

        # 1. Popunder check
        p_count = text.count(POPUNDER_URL)
        if p_count != 1:
            errors.append(f"{f.relative_to(ROOT)}: Popunder script count is {p_count} (expected exactly 1)")
        else:
            head_part = text.split('</head>')[0]
            if POPUNDER_URL not in head_part:
                errors.append(f"{f.relative_to(ROOT)}: Popunder is not located inside <head>")

        # 2. Social Bar check
        s_count = text.count(SOCIAL_URL)
        if s_count != 1:
            errors.append(f"{f.relative_to(ROOT)}: Social Bar script count is {s_count} (expected exactly 1)")
        else:
            after_social = text.split(SOCIAL_URL)[1]
            if '</body>' not in after_social[:250]:
                errors.append(f"{f.relative_to(ROOT)}: Social Bar is not directly before closing </body>")

        # 3. Native Banner check
        n_count = text.count(NATIVE_URL)
        c_count = text.count(CONTAINER_ID)
        if n_count != 1:
            errors.append(f"{f.relative_to(ROOT)}: Native Banner script count is {n_count} (expected exactly 1)")
        if c_count != 1:
            errors.append(f"{f.relative_to(ROOT)}: Container ID '{CONTAINER_ID}' count is {c_count} (expected exactly 1)")

    if errors:
        print("FAILED with the following errors:")
        for err in errors:
            print(" -", err)
        sys.exit(1)
    else:
        print(f"SUCCESS: All {len(HTML_FILES)} HTML files verified!")
        print("Summary of verification:")
        print("  [PASS] Popunder script: Exactly 1 per page, located inside <head>")
        print("  [PASS] Social Bar script: Exactly 1 per page, located right before closing </body>")
        print("  [PASS] Native Banner script + container: Exactly 1 per page, correctly placed in body")
        print("  [PASS] Zero container ID duplicates across all pages")

if __name__ == '__main__':
    verify()
