with open("system_prompt.txt", "r") as f:
    SYSTEM_PROMPT = f.read()

formatted_system_prompt = SYSTEM_PROMPT.format(user_id="2132")

print(formatted_system_prompt)