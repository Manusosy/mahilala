
import re

def check_balance(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check braces
    braces = 0
    for char in content:
        if char == '{': braces += 1
        elif char == '}': braces -= 1
    
    # Check parens
    parens = 0
    for char in content:
        if char == '(': parens += 1
        elif char == ')': parens -= 1
    
    # Check tags (very basic)
    tags = re.findall(r'<([a-zA-Z0-9]+)|</([a-zA-Z0-9]+)>', content)
    # This is too complex for a simple script, let's just use the brace/paren check
    
    print(f"Braces balance: {braces}")
    print(f"Parens balance: {parens}")

if __name__ == "__main__":
    check_balance(r"c:\Users\ADMIN\Desktop\Esaoraconsortium\esaora\artifacts\esaora-website\src\pages\GovernancePage.tsx")
