# chat-interface.py
import requests
import sys
import time
import itertools

def spinner(msg, duration=2):
    """Show a spinner animation with a message."""
    for _ in range(duration * 4):  # 4 spins per second
        for frame in "|/-\\":
            sys.stdout.write(f"\r{msg} {frame}")
            sys.stdout.flush()
            time.sleep(0.25)
    sys.stdout.write("\r" + " " * (len(msg) + 2) + "\r")  # clear line

def main():
    print(" Shoplite RAG Chat Interface")
    base_url = input(" Enter your ngrok URL (from Cell 8): ").strip()
    if not base_url.startswith("http"):
        print("uhoh! Invalid URL. It should look like https://xxxx.ngrok-free.app")
        sys.exit(1)

    print("\n Connected! Type 'exit' to quit.")
    print(" Switch prompt type: /prompt <name>")
    print(" Available: base_retrieval_prompt, multi_doc_prompt, clarification_prompt, concise_citation\n")

    current_prompt = "base_retrieval_prompt"

    while True:
        query = input("You: ")
        if query.lower() in ["exit", "quit"]:
            print("👋 Goodbye!")
            break

        # Switch prompt
        if query.startswith("/prompt "):
            chosen = query.replace("/prompt ", "").strip()
            if chosen in [
                "base_retrieval_prompt",
                "multi_doc_prompt",
                "clarification_prompt",
                "concise_citation" 
                
            ]:
                current_prompt = chosen
                print(f" Prompt type switched to: {current_prompt}\n")
            else:
                print(" Invalid prompt. Try again.\n")
            continue

        try:
            # Funny assistant workflow
            spinner("🤯 Thinking... (you're giving me a headache 🤕)", 2)
            spinner("📚 Searching dusty Shoplite scrolls...", 2)
            spinner("✍️ Scribbling a response with my tiny digital pen...", 2)

            # Send request
            r = requests.post(
                f"{base_url}/chat",
                json={
                    "query": query,
                    "prompt_type": current_prompt
                },
                timeout=60
            )

            if r.status_code == 200:
                data = r.json()
                print("\nAssistant:", data.get("response", "⚠ No 'response' field returned"))
                if "sources" in data:
                    print("📚 Sources:", data["sources"])
                print()
            else:
                print(f" Error {r.status_code}: {r.text}\n")

        except Exception as e:
            print(" Request failed:", str(e))

if __name__ == "__main__":
    main()
