import pandas as pd
import numpy as np
import json
import math
from urllib.parse import urlparse
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

def calculate_entropy(text):
    if not text: return 0
    prob = [float(text.count(c)) / len(text) for c in dict.fromkeys(list(text))]
    entropy = - sum([p * math.log(p) / math.log(2.0) for p in prob])
    return entropy

def extract_features(url):
    parsed = urlparse(url)
    hostname = parsed.hostname or ""
    path = parsed.path or ""
    
    # 1. url_length
    url_length = len(url)
    # 2. hostname_length
    hostname_length = len(hostname)
    # 3. dot_count
    dot_count = hostname.count('.')
    # 4. slash_count
    slash_count = path.count('/')
    # 5. subdomain_count
    subdomain_count = max(0, hostname.count('.') - 1)
    # 6. has_at
    has_at = 1 if '@' in url else 0
    # 7. has_dash
    has_dash = 1 if '-' in hostname else 0
    # 8. digit_ratio
    digits = sum(c.isdigit() for c in url)
    digit_ratio = digits / len(url) if len(url) > 0 else 0
    
    # 9. keyword_count
    keywords = ["login", "verify", "secure", "bank", "account", "update", "signin", "wp-admin"]
    keyword_count = sum(1 for kw in keywords if kw in url.lower())
    
    # 10. risky_tld
    risky_tlds = [".xyz", ".top", ".ga", ".ml", ".cf", ".gq", ".fit", ".tk"]
    risky_tld = 1 if any(hostname.endswith(tld) for tld in risky_tlds) else 0
    
    # 11. entropy
    entropy = calculate_entropy(url)
    
    return [
        url_length, hostname_length, dot_count, slash_count, 
        subdomain_count, has_at, has_dash, digit_ratio, 
        keyword_count, risky_tld, entropy
    ]

def export_model_to_json(clf, feature_names):
    """Parses Scikit-Learn Trees into the format expected by phishing_detector.js"""
    forest_dict = {
        "feature_names": feature_names,
        "n_trees": len(clf.estimators_),
        "trees": []
    }
    
    for estimator in clf.estimators_:
        tree = estimator.tree_
        node_count = tree.node_count
        tree_nodes = []
        
        for i in range(node_count):
            node = {
                "left": int(tree.children_left[i]),
                "right": int(tree.children_right[i]),
                "feature": int(tree.feature[i]),
                "threshold": float(tree.threshold[i]),
                "value": tree.value[i][0].tolist() # Probabilities/Counts
            }
            # Normalize leaf values to probabilities
            if node["left"] == -1:
                total = sum(node["value"])
                if total > 0:
                    node["value"] = [v / total for v in node["value"]]
            
            tree_nodes.append(node)
        forest_dict["trees"].append(tree_nodes)
        
    return forest_dict

# --- Main Execution ---
if __name__ == "__main__":
    print("Loading datasets...")
    # In a real scenario, you'd load a massive CSV. 
    # For now, we'll demonstrate with the provided current system dataset location
    try:
        df = pd.read_csv("dataset.csv")
    except FileNotFoundError:
        print("dataset.csv not found. Please provide a source CSV with 'url' and 'label' (0=benign, 1=phishing)")
        # Creating a small synthetic demo dataset if missing
        data = {
            "url": [
                "https://www.google.com", "https://github.com", "https://wikipedia.org",
                "http://verify-account-security-update.xyz/login.php",
                "http://amaz0n-secure-pay.top/signin",
                "https://paypal.customer-support-portal.ga/update"
            ],
            "label": [0, 0, 0, 1, 1, 1]
        }
        df = pd.DataFrame(data)
        df.to_csv("dataset.csv", index=False)
        print("Generated a synthetic 'dataset.csv' for demonstration.")

    print("Extracting features...")
    X = np.array([extract_features(u) for u in df['url']])
    y = df['label'].values
    
    feature_names = [
        "url_length", "hostname_length", "dot_count", "slash_count", 
        "subdomain_count", "has_at", "has_dash", "digit_ratio", 
        "keyword_count", "risky_tld", "entropy"
    ]

    print("Training Random Forest...")
    clf = RandomForestClassifier(n_estimators=10, max_depth=10, random_state=42)
    clf.fit(X, y)
    
    print("Exporting model to model_output.json...")
    model_json = export_model_to_json(clf, feature_names)
    
    with open("model_output.json", "w") as f:
        json.dump(model_json, f, indent=2)
        
    print("Done! You can now copy the contents of 'model_output.json' into 'phishing_detector.js'.")
