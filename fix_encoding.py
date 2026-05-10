
path = '/Users/onoderamasaru/.gemini/antigravity/scratch/popopo-site/index.html'
try:
    with open(path, 'rb') as f:
        data = f.read()
    # Try decoding as UTF-8, if it fails, it might be Shift-JIS
    try:
        content = data.decode('utf-8')
    except UnicodeDecodeError:
        content = data.decode('shift_jis')
    
    # Standardize to UTF-8
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Encoding normalized to UTF-8")
except Exception as e:
    print(f"Error: {e}")
