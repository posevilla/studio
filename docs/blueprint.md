# **App Name**: SITECS Triage Assist

## Core Features:

- Basic Triage (F.E.P): Input patient data and triage level (F.E.P).
- Advanced Triage (C.C.E.E): Calculate C.C.E.E. score based on input parameters such as oxygen needs, vital signs monitoring, medication, and unit-specific considerations.
- Resource Recommendation: Based on the C.C.E.E score, recommend the appropriate type and number of transport resources needed for evacuation (e.g., ambulance type).
- AI-Assisted Data Entry: Use an LLM as a tool to parse doctors' notes and lab results and pre-fill fields in the C.C.E.E form. Display all data points the LLM used in it's reasoning for the user to verify. Do not allow the triage score to be automatically submitted.

## Style Guidelines:

- Primary color: Sky blue (#7DD3FC) to evoke a sense of calmness and trustworthiness in emergency situations.
- Background color: Light gray (#F0F4F8) for a clean, neutral backdrop that reduces visual strain.
- Accent color: Soft lavender (#D6BBFC) to provide subtle contrast and highlight key interactive elements.
- Clean and legible sans-serif font for clear communication in stressful situations.
- Use clear, universal icons to represent different triage levels and resource types.
- Prioritize a clear, logical flow with large, tappable buttons. Ensure important information is readily accessible at a glance.
- Subtle transitions to reduce cognitive load when switching between screens. Add loading animations to communicate progress to the user