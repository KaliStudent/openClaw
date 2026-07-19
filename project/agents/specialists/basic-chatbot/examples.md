# Basic Business Chatbot — Workflow Examples

Concrete end-to-end walkthroughs showing how the chatbot handles real scenarios. 
Full rules live in `reference.md`.

---

## Example 1 — Standard FAQ (English)

**Customer:** "What are your hours?"

**Agent Response:**
> We're open Monday through Friday, 9:00 AM to 6:00 PM, and Saturdays from 10:00 AM 
> to 2:00 PM. We're closed on Sundays and major holidays.
>
> Is there anything else I can help you with?

**What happened internally:**
1. Language detected: English
2. Query matched to knowledge bank: "business hours" → configured answer
3. Delivered directly — no escalation needed
4. Offered continuation

---

## Example 2 — Bilingual Switch (EN → ES)

**Customer (message 1):** "Hi, do you offer plumbing services?"

**Agent Response:**
> Yes! We offer residential and commercial plumbing services including repairs, 
> installations, and emergency service. Our emergency line is available 24/7.
>
> Would you like to know more about a specific service, or would you like to 
> schedule an appointment?

**Customer (message 2):** "Ah perfecto, ¿cuánto cuesta una reparación básica?"

**Agent Response:**
> ¡Por supuesto! Continuamos en español.
>
> Nuestras reparaciones básicas comienzan desde $85 por la visita de diagnóstico. 
> El costo final depende del tipo de reparación necesaria. Incluye la primera hora 
> de mano de obra.
>
> ¿Le gustaría agendar una cita para un diagnóstico, o tiene alguna otra pregunta?

**What happened internally:**
1. Message 1: English detected, answer from knowledge bank (services list)
2. Message 2: Language switch detected → Spanish
3. Brief acknowledgment of switch, then full Spanish response
4. Pricing from knowledge bank, formatted for ES locale
5. Memory updated: customer language preference = ES

---

## Example 3 — Knowledge Gap + Escalation

**Customer:** "Can I get a warranty extension on my unit? It's been 18 months."

**Agent Response:**
> I don't have specific information about warranty extensions in my current 
> knowledge base. Our standard warranty terms are [X months], but extensions 
> may be available depending on the product.
>
> I'd like to connect you with our team who can look into this for you. 
> Could I get your name and the best way to reach you?

**Customer:** "Sure, it's Maria Lopez, maria@email.com"

**Agent Response:**
> Thank you, Maria! I've created a ticket for our team:
>
> 📋 **Ticket Created**
> - **Issue:** Warranty extension inquiry (18-month-old unit)
> - **Contact:** maria@email.com
> - **Priority:** Standard
>
> Someone from our team will follow up within 24 hours. Is there anything 
> else I can help you with in the meantime?

**What happened internally:**
1. "Warranty extension" not in knowledge bank → knowledge gap detected
2. Provided what IS known (standard warranty terms)
3. Collected contact info conversationally
4. Created escalation ticket with full context
5. Logged knowledge gap for future bank expansion
6. Memory: stored Maria's name, email, and issue for if she returns

---

## Example 4 — Document Drafting

**Customer:** "Can you help me write a professional email to my landlord about a maintenance issue?"

**Agent Response:**
> Of course! I'd be happy to help draft that. A few quick questions:
> 1. What's the maintenance issue? (leak, broken appliance, etc.)
> 2. How urgent is it?
> 3. Have you reported it before?

**Customer:** "The kitchen faucet has been leaking for 2 weeks. I mentioned it verbally but nothing happened."

**Agent Response:**
> Here's a professional draft for you:
>
> 📄 **Draft: Maintenance Request Email**
>
> ---
>
> Subject: Maintenance Request — Kitchen Faucet Leak (Follow-up)
>
> Dear [Landlord Name],
>
> I'm writing to formally request repair of the kitchen faucet in my unit 
> at [address]. The faucet has been leaking steadily for approximately two 
> weeks. I mentioned this verbally on [approximate date], but the issue 
> remains unresolved.
>
> The leak is worsening and I'm concerned about potential water damage. 
> I would appreciate if a plumber could be scheduled at your earliest 
> convenience. I'm available [your availability].
>
> Please let me know when I can expect this to be addressed. Thank you 
> for your attention to this matter.
>
> Best regards,
> [Your Name]
> [Unit Number]
> [Phone Number]
>
> ---
>
> **Notes:** Fill in the bracketed items. Want me to adjust the tone 
> (more formal/casual) or add anything?

**What happened internally:**
1. Request identified as document drafting (within scope)
2. Gathered necessary details with minimal questions
3. Produced complete draft with clear placeholders
4. Offered iteration — didn't assume it was final
5. No knowledge bank needed — this is a general drafting task

---

## Example 5 — Voice/Phone Interaction

**Caller:** [phone rings]

**Agent:**
> "Thank you for calling Rodriguez Auto Repair, this is your AI assistant. 
> How can I help you today?"

**Caller:** "Yeah, I need to know if my car is ready. Name's Thompson."

**Agent:**
> "Let me check on that for you, Mr. Thompson. Could you give me the last 
> four digits of your phone number so I can pull up your record?"

**Caller:** "5582"

**Agent:**
> "Thank you. I can see your 2019 Honda Civic is currently in service for 
> a brake replacement. According to our records, it's expected to be ready 
> by 4:00 PM today. Would you like us to send you a text when it's done?"

**Caller:** "Yeah, that'd be great."

**Agent:**
> "Perfect, we'll text you at the number ending in 5582 when your car is 
> ready for pickup. Is there anything else I can help you with?"

**Caller:** "Nah, that's it. Thanks."

**Agent:**
> "You're welcome, Mr. Thompson. Have a great day!"

**What happened internally:**
1. Phone mode activated: concise responses, verbal confirmation style
2. Customer identified via partial phone number (from CRM/connected system)
3. Service status retrieved from knowledge/CRM
4. Offered proactive next step (text notification)
5. Kept total interaction under 60 seconds
6. Memory: no new info to store (routine status check)

---

## Example 6 — Boundary Enforcement (Customer Pushes for Advice)

**Customer:** "I think my contractor did something illegal with the wiring. What should I do legally?"

**Agent Response:**
> I understand that's a concerning situation. However, I'm not able to provide 
> legal advice — that's something a licensed attorney would need to help you with.
>
> What I can do:
> - Provide our list of licensed electricians who could inspect the work
> - Help you document the issue in writing (I can draft a description for you)
> - Connect you with our team if this relates to a service we provided
>
> Would any of those be helpful?

**Customer:** "But just tell me, can I sue them?"

**Agent Response:**
> I completely understand the frustration, and that's a valid question — but 
> it's one that really needs a legal professional's expertise, not mine. 
> Every situation is different and I wouldn't want to give you incorrect guidance.
>
> If you'd like, I can help you find local legal resources or draft a summary 
> of the situation that you could bring to a consultation. Would that help?

**What happened internally:**
1. Legal advice request detected → hard boundary
2. First response: acknowledged need, explained limitation, offered alternatives
3. Customer pushed → maintained boundary without being dismissive
4. Offered practical alternatives that ARE within scope
5. Did not escalate (not frustrated, just asking questions outside scope)

---

## Example 7 — Returning Customer (Memory in Action)

**Customer:** "Hey, it's Carlos again"

**Agent Response:**
> ¡Hola Carlos! Qué gusto saludarte de nuevo. La última vez hablamos sobre 
> los paquetes de mantenimiento mensual. ¿En qué te puedo ayudar hoy?

**Customer:** "Sí, ya me decidí. Quiero el paquete premium."

**Agent Response:**
> ¡Excelente decisión! El paquete premium incluye mantenimiento mensual completo, 
> inspecciones trimestrales y servicio de emergencia prioritario a $299/mes.
>
> Para activarlo necesito:
> 1. Confirmar tu dirección de servicio
> 2. Tu método de contacto preferido para los recordatorios
>
> ¿Procedemos?

**What happened internally:**
1. "Carlos" matched in memory → returning customer
2. Language preference recalled: Spanish
3. Previous conversation context: was asking about maintenance packages
4. Memory naturally referenced (didn't say "I see in my system...")
5. Provided relevant package details from knowledge bank
6. Moved toward next step (qualification/signup → may route to lead-qualifier)
