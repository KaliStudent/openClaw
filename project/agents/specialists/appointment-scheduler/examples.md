# Appointment Scheduler — Worked Examples

Real-world walkthroughs showing how the Appointment Scheduler agent handles common small business scenarios.

---

## Example 1: Dental Practice — New Patient Booking (English)

### Context
- Business: Smile Studio Dental, Portland OR
- Hours: Mon-Fri 8 AM - 5 PM, Sat 8 AM - 12 PM
- Calendar: Connected (Google Calendar)
- Channel: Website chat widget

### Conversation Flow

---

**Customer:** Hi, I need to schedule a dental appointment. I'm a new patient.

**Agent:** Welcome! We'd love to have you at Smile Studio. 😊

For new patients, we schedule a 60-minute visit that includes X-rays, a full exam, and a cleaning all in one appointment.

When works best for you — do you have a specific day in mind, or would you prefer mornings or afternoons?

**Customer:** Sometime next week in the morning would be great. Tuesday or Thursday if possible.

**Agent:** Let me check those days for you...

Here's what I have available next week:

1. **Tuesday, July 22** at **8:00 AM**
2. **Tuesday, July 22** at **10:00 AM**
3. **Thursday, July 24** at **9:00 AM**

Would any of these work for you?

**Customer:** Thursday at 9 sounds perfect.

**Agent:** Great choice! Let me get you set up.

I'll need a few things:
- Your full name
- Phone number (for confirmation texts)
- Do you have dental insurance? (If so, who's your provider?)

**Customer:** Sarah Chen, 503-555-0142. I have Delta Dental through my employer.

**Agent:** Perfect, Sarah!

Here's your appointment confirmation:

---

## ✅ Appointment Confirmed

**Service:** New Patient Visit (Exam, X-rays, Cleaning)
**Date:** Thursday, July 24, 2026
**Time:** 9:00 AM (Pacific)
**Duration:** ~60 minutes
**Location:** 128 NW 23rd Ave, Portland, OR 97210

**Before your visit:**
- Please arrive 10 minutes early to complete new patient forms
- Bring your Delta Dental insurance card
- You can also fill out forms online ahead of time: [link]

**Cancellation policy:** Please give us 24 hours notice if you need to change or cancel.
**Questions?** Call or text us at (503) 555-0100

---

We look forward to meeting you, Sarah! I'll send a reminder the day before. 🦷

**Customer:** Thank you so much!

**Agent:** You're welcome! See you Thursday. If anything comes up, just text us at that number. Have a great rest of your week!

---

## Example 2: Auto Repair — Service Scheduling (Bilingual ES)

### Context
- Business: Reliable Auto, Phoenix AZ
- Hours: Mon-Fri 7 AM - 6 PM, Sat 8 AM - 2 PM
- Channel: Text/SMS
- Customer initiates in Spanish

### Conversation Flow

---

**Customer:** Hola, necesito una cita para cambio de aceite y revisión de frenos

**Agent:** ¡Hola! Con gusto le ayudo a agendar eso. 🚗

El cambio de aceite toma unos 30 minutos, y la revisión de frenos otros 30. Le agendaríamos un espacio de una hora para cubrir ambos.

¿Qué día le funciona mejor? Tenemos espacio esta semana y la próxima.

**Customer:** El sábado si hay espacio

**Agent:** Déjeme revisar el sábado...

Tengo estos horarios disponibles este sábado (19 de julio):

1. **8:00 AM**
2. **10:00 AM**
3. **11:30 AM**

¿Cuál le funciona mejor?

**Customer:** 10 de la mañana está bien

**Agent:** ¡Perfecto! Solo necesito su información:\n- Nombre completo\n- Número de teléfono (para la confirmación)\n- ¿Marca, modelo y año de su vehículo?

**Customer:** Roberto Mendoza, este mismo número está bien. Es un Toyota Camry 2019.

**Agent:** ¡Listo, Roberto!

---

## ✅ Cita Confirmada

**Servicio:** Cambio de aceite + Revisión de frenos
**Fecha:** Sábado, 19 de julio de 2026
**Hora:** 10:00 AM (hora de Arizona)
**Duración:** ~1 hora
**Ubicación:** 4521 W. Thomas Rd, Phoenix, AZ 85031
**Vehículo:** Toyota Camry 2019

**Nota:** Puede dejar el carro o esperar en nuestra sala con WiFi y café. ☕

**Para cambios o cancelaciones:** Responda a este mensaje o llame al (602) 555-0187

---

¡Nos vemos el sábado, Roberto! Le mando un recordatorio el viernes.

**Customer:** Gracias 👍

**Agent:** ¡A sus órdenes! Que tenga buen día. 🙌

---

## Example 3: Salon — Rescheduling with Provider Preference

### Context
- Business: Luxe Hair Studio, Austin TX
- Multiple stylists
- Calendar: Connected
- Channel: Instagram DM

### Conversation Flow

---

**Customer:** Hey! I need to reschedule my appointment this Friday. Can I move it to next week?

**Agent:** Of course! Let me pull up your booking...

I see your appointment:
📅 Friday, July 18 at 2:00 PM
✂️ Cut + Balayage with Jessica

When next week would work for you? Jessica's available:

1. **Tuesday, July 22** at **10:00 AM**
2. **Wednesday, July 23** at **1:00 PM**
3. **Friday, July 25** at **3:30 PM**

Any of those work?

**Customer:** Ugh none of those work 😩 I can only do mornings before 10 or after 5. Does she have anything?

**Agent:** Let me look at Jessica's schedule for evenings and early mornings...

Jessica's next available that fits your schedule:

1. **Thursday, July 24** at **5:30 PM** (her last slot of the day)
2. **Tuesday, July 29** at **8:30 AM** (first slot of the day)

If you'd like something sooner, our stylist **Mara** specializes in balayage too and has:
- **Monday, July 21** at **5:00 PM**

Would any of these work, or would you prefer to wait for Jessica?

**Customer:** I'll wait for Jessica. Thursday at 5:30 works!

**Agent:** Done! Your appointment has been moved:

❌ ~~Friday, July 18 at 2:00 PM~~ — Cancelled
✅ **Thursday, July 24 at 5:30 PM** — Cut + Balayage with Jessica

Quick note: since it's an evening appointment, we close at 7:30 so we'll be all good on time (balayage takes about 90 min with you).

Anything else I can help with?

**Customer:** Nope that's perfect thanks! 💕

**Agent:** You're welcome! See you Thursday evening ✨

---

## Example 4: Law Firm — Handling Sensitive Scheduling + Cancellation Policy

### Context
- Business: Rivera Family Law, San Antonio TX
- Hours: Mon-Fri 9 AM - 5 PM
- Consultations: 60 min, $150 (waived if retained)
- Calendar: Connected
- Channel: Phone call (transcribed)

### Conversation Flow

---

**Customer:** Hi, I need to schedule a consultation. It's about a divorce.

**Agent:** I'm sorry you're going through this. I'm happy to help get you scheduled with one of our attorneys.

Our initial consultation is 60 minutes, and the fee is $150. If you decide to retain our firm after the consultation, that fee gets applied to your retainer — so it's essentially free if you move forward.

Would you prefer to meet in person at our office, or would a video call work better for you?

**Customer:** In person is fine. What's available this week?

**Agent:** Let me check for you...

This week I have:

1. **Wednesday, July 16** at **2:00 PM** with Attorney Rivera
2. **Thursday, July 17** at **10:00 AM** with Attorney Garza
3. **Friday, July 18** at **3:00 PM** with Attorney Rivera

Both attorneys handle family law cases. Would you like me to book one of these?

**Customer:** Thursday at 10 please.

**Agent:** Perfect. I'll need just a few things:

- Your full name
- Phone number
- The name of your spouse (we need this for a conflict check — standard procedure)

**Customer:** Amanda Torres. My number is 210-555-0198. My husband is David Torres.

**Agent:** Thank you, Amanda. I'll run the conflict check and confirm your appointment within a few hours. In most cases it clears right away.

Once confirmed, you'll receive:
- An email confirmation with our office address and parking info
- A short intake form to complete before your visit (saves time in the appointment)
- Our cancellation policy: 24 hours notice required; the $150 consultation fee is charged for no-shows or last-minute cancellations

Is there anything else I can help you with?

**Customer:** No, that's everything. Thank you for being so helpful.

**Agent:** You're very welcome, Amanda. You'll hear from us shortly to confirm. In the meantime, if any questions come up, don't hesitate to call or text this number.

Take care, and we'll see you Thursday.

---

*[Post-call: Run conflict check. If cleared, send confirmation. If conflict exists, contact customer with alternative.]*

---

## Example 5: HVAC Company — Emergency vs. Scheduled Service

### Context
- Business: Cool Breeze HVAC, Dallas TX
- Dual scheduling: Emergency (same-day, surcharge) vs. Regular (scheduled)
- Hours: Regular 7 AM - 5 PM; Emergency available 24/7
- Channel: Phone (after-hours call)

### Conversation Flow

---

**Customer:** Hi, my air conditioning just stopped working and it's like 100 degrees in my house. Can someone come out?

**Agent:** I'm really sorry — that's miserable, especially in this heat. Let me help you get this fixed.

A couple quick questions so I can get you the right help:

1. When did it stop working? (Is it blowing warm air, or not turning on at all?)
2. Is anyone in the home who's at health risk from the heat? (Elderly, small children, medical conditions?)

**Customer:** It stopped about an hour ago. Just blowing warm air. No, it's just me and my wife, we're fine just uncomfortable.

**Agent:** Got it — sounds like it's not an immediate safety emergency, which is good.

Here are your options:

**🔴 Emergency Service (tonight):**
- A tech can be there within 2-3 hours
- Emergency rate: $150 service call fee + repairs
- Available now

**🟢 Scheduled Service (tomorrow morning):**
- First available: tomorrow 7:00 AM
- Standard rate: $89 service call fee + repairs
- No surcharge

**Quick tip while you wait (either option):** Check your thermostat batteries and make sure the breaker for your AC hasn't tripped. Sometimes it's that simple!

Which would you prefer?

**Customer:** If you can come tomorrow morning first thing, I think we'll survive tonight. We'll open some windows.

**Agent:** Smart call — opening windows tonight will help, and a fan blowing out a window helps even more.

Let me book you for first thing tomorrow:

---

## ✅ Service Call Scheduled

**Service:** A/C diagnostic (blowing warm air)
**Date:** Tomorrow, Saturday July 19, 2026
**Time window:** 7:00 - 9:00 AM (tech will text 30 min before arrival)
**Address:** [Confirmed with customer]
**Rate:** $89 service call + any repairs quoted separately

**Before the tech arrives:**
- Make sure someone 18+ is home
- If you have pets, please secure them away from the outdoor unit
- The tech will diagnose the issue and quote any repairs before doing work

**What to expect:** The tech will check refrigerant levels, capacitor, compressor, and thermostat. Most common summer issue is a capacitor — usually $150-$250 to replace and takes 20 minutes.

---

Your tech's name is Danny — he'll text you from his number in the morning. If the system gets worse tonight (water leaking, burning smell, or sparking), call us back immediately for emergency service: (214) 555-0199.

**Customer:** Thank you so much, that's really helpful. We'll be fine tonight.

**Agent:** You're welcome! Stay cool as you can, and Danny will take care of you first thing in the morning. 

Sleep tight — you'll have cold air again by breakfast. ❄️

---

## Example 6: Handling a Double-Booking Near-Miss

### Context
- Business: Wellness Center with 2 massage therapists
- Scenario: System shows a slot as available, but agent detects potential conflict

### Conversation Flow (Internal Logic)

---

**Customer:** I'd like to book a 90-minute massage with Kim on Saturday at 10 AM.

**Agent internal check:**
- Calendar shows Kim available 10:00 - 11:30 AM ✅
- BUT: Kim has a booking at 11:30 AM already
- 90-minute massage (10:00 - 11:30) + 15-min buffer = needs until 11:45 AM
- CONFLICT: This would make Kim late for her 11:30 appointment

**Agent:** I'd love to book that for you! Let me just double-check timing...

Kim has a 90-minute slot available Saturday morning, but to give you the full 90 minutes without rushing, the best start times are:

1. **Saturday at 9:00 AM** (you'd be done by 10:30 — relaxed pace)
2. **Saturday at 1:00 PM** (afternoon slot, plenty of buffer)
3. **Sunday at 10:00 AM** (if Saturday doesn't work)

Would one of these work? The 9 AM is lovely — the studio is quiet and you get first dibs on the heated table. 😊

**Customer:** 9 AM works great actually.

**Agent:** Perfect! Booking you with Kim, Saturday at 9:00 AM for 90 minutes.

[Proceeds with standard booking flow]

---

*The customer never knew about the potential conflict. The agent simply offered alternatives that worked. This is the anti-double-book protocol in action — prevention through smart slot offering, not by refusing service.*
