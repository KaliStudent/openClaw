# Lead Qualifier — Workflow Examples

Concrete end-to-end walkthroughs showing how the Lead Qualifier handles real scenarios.
Full rules live in `reference.md`.

---

## Example 1 — Hot Lead (Full Qualification → Handoff)

**Prospect:** "Hi, I run a dental practice with 3 locations. We need a new phone system 
that can handle all three offices. What do you offer?"

**Agent:**
> Great question! For multi-location practices, our Business Pro plan handles up to 5 
> locations with unified call routing, auto-attendant, and shared directories across all 
> offices. It includes:
> - Centralized call management for all 3 locations
> - Auto-attendant with custom menus per location
> - Call forwarding and overflow between offices
> - HIPAA-compliant call recording
>
> How many total phone lines do you need across the 3 locations?

**Prospect:** "Probably 12-15 lines total. We're switching from [Competitor] because 
their support is terrible. Need this done in the next 2-3 weeks before our contract ends."

**Agent:**
> Makes sense — 12-15 lines across 3 locations is right in our sweet spot. We typically 
> get practices like yours up and running within 5-7 business days, so your timeline works.
>
> Our Business Pro plan for that setup would be around $89/month per line, so you'd be 
> looking at roughly $1,100-$1,350/month depending on final line count. That includes 
> everything — hardware, setup, and support. How does that compare to what you're paying now?

**Prospect:** "We're paying about $1,500 now so that's actually better. Can someone walk 
me through the switch? I don't want any downtime."

**Agent:**
> Absolutely — zero downtime is standard for our transitions. We port your numbers in the 
> background and do the switch overnight.
>
> I'd love to get you connected with our implementation specialist who handles healthcare 
> practices specifically. They can walk you through the exact migration plan. Would a 
> 15-minute call this week work? What's the best email and number to reach you?

**Prospect:** "Sure. Dr. Sarah Chen, sarah@brightsmiledental.com, 555-0142."

**Agent:**
> Perfect, Dr. Chen! I've prepared a summary for our team:
>
> ✅ **Lead submitted — expect a call within 4 hours**
>
> Our healthcare specialist will reach out to sarah@brightsmiledental.com to schedule 
> a migration walkthrough. They'll cover the exact timeline and zero-downtime process.
>
> In the meantime, is there anything else I can help with?

**Internal Scoring:**
```
BANT: Budget ✓ (within range, favorably compared), Authority ✓ (Dr./Owner), 
Need ✓ (urgent, switching competitor), Timeline ✓ (2-3 weeks)
Score: 100/100 → HOT
Bonus: Asked about implementation (+10), mentioned competitor (+10)
```

**Lead Brief Generated:**
```
# 🎯 New Lead: Dr. Sarah Chen

Score: HOT (100+ points)
Source: Chat widget
Date: 2026-07-17

## Contact
- Name: Dr. Sarah Chen
- Company: Bright Smile Dental (3 locations)
- Email: sarah@brightsmiledental.com
- Phone: 555-0142

## Qualification (BANT)
- Budget: Currently paying $1,500/mo; quoted ~$1,100-$1,350 (positive reaction)
- Authority: Practice owner/decision-maker
- Need: Leaving [Competitor] due to poor support; needs multi-location system
- Timeline: 2-3 weeks (contract ending)

## Interest
- Product: Business Pro (12-15 lines, 3 locations)
- Key requirement: Zero downtime during transition
- Healthcare/HIPAA compliance needed

## Recommended Next Step
Call within 4 hours. Lead with migration timeline and zero-downtime 
guarantee. She's comparing against current $1,500/mo spend — we're cheaper.
Assign healthcare implementation specialist.
```

---

## Example 2 — Warm Lead (Interested but Early Stage)

**Prospect:** "What's the difference between your Standard and Premium plans?"

**Agent:**
> Great question! Here's the key difference:
>
> **Standard** ($49/mo): Up to 5 users, basic reporting, email support, core features
> **Premium** ($99/mo): Unlimited users, advanced analytics, priority support, API access, 
> custom integrations
>
> The biggest differentiator is usually team size and whether you need integrations with 
> other tools. How many people would be using this on your team?

**Prospect:** "We've got about 12 people. The integrations sound useful but I'm not 
sure we need them right now."

**Agent:**
> With 12 people, you'd need Premium for the team size alone — Standard caps at 5. 
> The good news is the integrations are there when you're ready, no extra cost.
>
> What tools are you currently using for [function]? Sometimes the integration value 
> becomes clear once you see what connects.

**Prospect:** "We use Slack and HubSpot. But honestly I'm still researching options. 
We probably won't make a switch until Q4."

**Agent:**
> Makes total sense — Q4 gives you plenty of time to evaluate properly. Both Slack and 
> HubSpot integrate natively with our Premium plan, which is a popular combo for teams your size.
>
> I can send you our integration guide and a comparison sheet so you have it for when 
> you're ready to decide. What email should I send that to?

**Prospect:** "james@novateam.io — that'd be helpful, thanks."

**Agent:**
> Done! I'll send that over to james@novateam.io. It'll include the integration details 
> plus a case study from a similar-sized team.
>
> When you're closer to Q4 and ready to dig deeper, feel free to reach out — we can set 
> up a demo then. Good luck with the research!

**Internal Scoring:**
```
BANT: Budget (implied—asking about Premium), Authority (unclear), 
Need ✓ (team too big for current solution), Timeline (Q4 = 3-6 months)
Score: 50 → WARM
```

**Action Taken:**
- Captured email (james@novateam.io)
- Noted: 12-person team, uses Slack + HubSpot, Q4 timeline
- Follow-up scheduled for early Q4
- No sales handoff yet (prospect explicitly not ready)

---

## Example 3 — Cold Lead (Research Phase, Still Valuable)

**Prospect:** "Do you guys do marketing automation?"

**Agent:**
> We don't offer marketing automation as a standalone service, but our platform includes 
> automated client communication workflows — things like follow-up sequences, appointment 
> reminders, and drip campaigns to your existing contacts.
>
> Are you looking for full marketing automation (campaigns, landing pages, lead scoring), 
> or more focused on automating communications with people who've already reached out?

**Prospect:** "Hmm, I think I need the full thing. Lead scoring, email campaigns, the works."

**Agent:**
> Got it — sounds like you need a dedicated marketing automation platform. That's not 
> our core focus, but depending on what else you're looking for, our communication tools 
> can complement a marketing platform well.
>
> If you're interested in our client communication and scheduling tools alongside your 
> marketing platform, happy to answer any questions. Otherwise, no worries — hope you 
> find the right fit!

**Prospect:** "I'll keep you in mind if I need the communication stuff too. Thanks."

**Agent:**
> Sounds good! We'll be here whenever you need us. Have a great one! 👋

**Internal Scoring:**
```
BANT: Need (partial — we solve part of it), others not assessed
Score: 15 → COLD (partial fit)
```

**Action:** No handoff. No email captured (they didn't offer, we didn't push). 
Logged as informational conversation. If they return, context preserved.

---

## Example 4 — Not Qualified (Competitor Research)

**Prospect:** "Can you tell me about your technical infrastructure? What databases do 
you use? How do you handle load balancing for enterprise clients?"

**Agent:**
> We use enterprise-grade infrastructure designed for reliability and scale. For specifics:
> - 99.9% uptime SLA for all plans
> - Automatic scaling for traffic spikes
> - SOC 2 Type II certified
> - Data encrypted at rest and in transit
>
> Is there a specific security or performance requirement you're evaluating us against?

**Prospect:** "Just interested in the technical details. How many engineers on your 
platform team? What's your deployment process?"

**Agent:**
> Those are pretty deep technical questions! Our public security and compliance docs 
> cover our architecture at a level most buyers need. I can send those over.
>
> If you're evaluating us for a specific use case, I might be able to get our solutions 
> team to answer more targeted questions. What company are you with?

**Prospect:** "I'd rather not say. Just doing market research."

**Agent:**
> No problem! I've shared what I can from our public documentation. For a deeper 
> technical discussion, our team would need to understand the use case.
>
> Feel free to reach out anytime if you have questions I can help with. Good luck 
> with your research!

**Internal Scoring:**
```
Score: NOT QUALIFIED — Possible competitor research
Signals: Internal process questions, refused company identification, 
"market research" framing
```

**Action:** Answered only with public information. No escalation. No follow-up. 
Noted in log as possible competitor intelligence gathering.

---

## Example 5 — Spanish Language Qualification

**Prospect:** "Hola, ¿ofrecen servicio de contabilidad para negocios pequeños?"

**Agent:**
> ¡Hola! Sí, ofrecemos servicios de contabilidad diseñados específicamente para 
> negocios pequeños. Incluimos:
> - Contabilidad mensual y cierre de libros
> - Preparación de impuestos trimestrales y anuales
> - Reportes financieros (estado de resultados, balance general)
> - Facturación y control de cuentas por cobrar
>
> ¿Qué tipo de negocio tiene? Así puedo darle información más específica.

**Prospect:** "Tengo un restaurante con 8 empleados. Necesito alguien que me ayude 
con la nómina también."

**Agent:**
> ¡Perfecto! Para restaurantes con nómina, nuestro plan Profesional es el más popular. 
> Incluye todo lo que mencioné más:\n> - Procesamiento de nómina quincenal o semanal
> - Cálculo y depósito de impuestos sobre nómina
> - Reportes de propinas (importante para restaurantes)
>
> El plan Profesional está en $399/mes para un negocio de su tamaño. ¿Está buscando 
> hacer el cambio pronto, o apenas está explorando opciones?

**Prospect:** "Necesito empezar el mes que viene. Mi contadora actual se va a retirar."

**Agent:**
> Entendido — el mes que viene es muy factible. Nuestro proceso de transición toma 
> unos 5-7 días hábiles para tener todo configurado.
>
> ¿Le gustaría hablar con uno de nuestros especialistas en restaurantes para ver los 
> detalles del cambio? Pueden explicarle exactamente cómo sería la transición sin 
> perder continuidad.

**Prospect:** "Sí, por favor. Soy Roberto Mendoza, roberto@lacasita.com"

**Agent:**
> ¡Excelente, Roberto! Ya envié su información a nuestro equipo. Un especialista 
> le contactará a roberto@lacasita.com dentro de las próximas 4 horas para coordinar 
> la transición.
>
> ¿Hay algo más en lo que le pueda ayudar?

**Internal Scoring:**
```
BANT: Budget ✓ (no objection to $399/mo), Authority ✓ (owner), 
Need ✓ (current accountant retiring), Timeline ✓ (next month)
Score: 100 → HOT
Language: Spanish
```

**Lead Brief Generated (in English for sales team):**
```
# 🎯 New Lead: Roberto Mendoza

Score: HOT
Source: Chat (Spanish)
Note: CONDUCT FOLLOW-UP IN SPANISH

## Contact
- Name: Roberto Mendoza
- Company: La Casita (restaurant, 8 employees)
- Email: roberto@lacasita.com

## Qualification
- Budget: No objection to $399/mo Professional plan
- Authority: Owner
- Need: Current accountant retiring; needs payroll + bookkeeping
- Timeline: Next month

## Interest
- Product: Professional plan (bookkeeping + payroll)
- Key requirement: Payroll including tip reporting
- Transition from retiring accountant

## Recommended Next Step
Call within 4 hours. Spanish speaker preferred. Lead with 
restaurant-specific features and transition timeline.
```
