# Master Agent — Skill Registry

The Master Agent incorporates ALL specialist skills and can operate in any mode.

## Registered Skills

| Skill ID | Name | Source Agent | Category |
|----------|------|-------------|----------|
| `core_conversation` | Core Conversation | Built-in | core |
| `business_info` | Business Info | Built-in | core |
| `language` | Multilingual (EN/ES) | Built-in | core |
| `escalation` | Escalation & Ticketing | Built-in | core |
| `basic_chatbot` | Basic Chatbot (Full) | basic-chatbot | general |
| `document_drafting` | Document Drafting | basic-chatbot | productivity |
| `web_crawling` | Web Crawling & Knowledge | basic-chatbot + knowledgebase | knowledge |
| `lead_qualification` | Lead Qualification | lead-qualifier | sales |
| `meeting_prep` | Meeting Preparation | meeting-prep | productivity |
| `client_onboarding` | Client Onboarding | client-onboarding | operations |
| `email_meeting_summary` | Email & Meeting Summary | email-meeting-summary | productivity |
| `basic_secretary` | Basic Secretary | basic-secretary | admin |
| `executive_assistant` | Executive Assistant (All) | executive-assistant | premium |
| `customer_service` | Customer Service | customer-service | support |
| `knowledgebase` | Knowledge Bank (Tiered) | knowledgebase | knowledge |
| `appointment_scheduling` | Appointment Scheduling | customer-service | operations |
| `receptionist_phone` | Phone Receptionist | basic-chatbot + secretary | voice |
| `voice_communication` | Voice Chat | Built-in | communication |

## Deployment Modes

### Mode: `master`
All skills active. Full capability. Used for internal testing or premium customers.

### Mode: `configured`
Customer selects which skills to enable. Agent only operates within enabled skills.

### Mode: `specialist`
Single skill + core skills. Optimized prompting, lower token usage, faster responses.

### Mode: `minimal`
Core conversation + business info only. Cheapest to run. Basic FAQ bot.

## Skill Loading

When deployed, the Master Agent's system prompt is constructed by:

1. Base prompt (identity, language, boundaries)
2. Business profile injection
3. Enabled skill prompts concatenated
4. Channel-specific behavior rules
5. Memory context (if returning customer)
6. Knowledge bank context (relevant entries)

```
System Prompt = BASE + BUSINESS + Σ(ENABLED_SKILLS) + CHANNEL + MEMORY + KNOWLEDGE
```

## Cost Optimization

| Mode | Avg System Prompt Size | Model Recommendation |
|------|----------------------|---------------------|
| minimal | ~500 tokens | Llama 3.1 8B (Groq) |
| specialist | ~1000 tokens | Llama 3.1 8B (Groq) |
| configured (3-4 skills) | ~2000 tokens | GPT-4o-mini |
| master (all skills) | ~4000 tokens | GPT-4o-mini / Sonnet |
| executive_assistant | ~3000 tokens | GPT-4o-mini / Sonnet |
