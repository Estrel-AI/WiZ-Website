import { Fragment, ReactNode } from "react";

export type PolicyKey = "terms" | "privacy" | "cookies";

type PolicyEntry = {
  title: string;
  content: string;
};

const termsContent = `Beta Terms and Conditions - WiiZ 2.0 (Beta)
BETA Policy Version: 2.0
Last Updated: 14 May 2026

1. Introduction and Definitions
1.1 Purpose of These Terms
These Beta Terms and Conditions (“Terms”) govern your access to and use of WiiZ 2.0 (Beta) and associated WiiZ platform capabilities (the “Service”) provided by Estrel AI Ltd, a company incorporated in the Dubai International Financial Centre (DIFC).
These Terms establish the legal and commercial framework governing access to the Service during its Beta phase, including:
•	Platform access and subscription plans;
•	Credit consumption and usage mechanics;
•	Platform capabilities and operational limitations;
•	Data handling, security, and governance obligations;
•	Service levels and support structures;
•	Rights, obligations, liabilities, and operational responsibilities.
These Terms apply to all access to and use of:
•	https://hub.wiiz.it; https://wbs.wiiz.it;
•	www.wiiz.it;
•	Any associated interfaces, APIs, orchestration layers, Intent Studio capabilities, Python execution environments, EvalOps tooling, guardrails, vector databases, integrations, or related services;
•	User manuals, operational documentation, and in-platform guidance.
In the event of any inconsistency between these Terms and any supporting material, these Terms shall prevail unless expressly stated otherwise in writing.

1.2 Definitions
“Estrel AI”, “we”, “us”, or “our”
Means Estrel AI Ltd, a company incorporated in the Dubai International Financial Centre (DIFC).
“WiiZ”
Means the AI orchestration and execution platform operated by Estrel AI Ltd.
“WiiZ 2.0”
Means the current Beta version of the WiiZ platform, including orchestration workflows, Intent Studio, EvalOps, orchestration tooling, governance layers, and related capabilities. This includes sub variants released under 2. For example 2.0.1, 2.1.5 etc. shall be considered as WiiZ 2.0.
“Platform”
Means WiiZ 2.0 (Beta) together and its sub variants with all associated software, orchestration engines, AI tooling, APIs, interfaces, services, and supporting infrastructure.
“Beta”
Means the Service is provided in a pre-General Availability (GA) state for testing, evaluation, controlled commercial adoption, operational validation, and feedback purposes.
“Credits”
Means the platform consumption unit used for measurement, allocation, limitation, billing, and operational enforcement purposes.
Credits are consumed based on workflow execution activity, iteration processing, Intent Studio interactions, and any additional usage mechanics introduced by Estrel AI. 
“Workflow Execution”
Means the complete end-to-end execution of a workflow process.
“Workflow Iteration”
Means any repeated iteration, loop, recursive execution, or repeated processing action occurring within a workflow execution.
“Intent Studio Transaction”
Means any AI-generated response or outbound response generated through Intent Studio.
“Subscription Plan”
Means a paid or promotional service tier made available by Estrel AI Ltd.
“User”, “you”, or “your”
Means the individual or legal entity accessing or using the Platform.

2. Purpose and Scope of the Beta Programme
WiiZ 2.0 (Beta) is provided as a controlled Beta platform for evaluation, commercial validation, operational adoption, workflow orchestration, and AI capability testing.
The Beta Programme includes:
•	Validation of orchestration workflows and reasoning systems;
•	Testing of Intent Studio conversational capabilities;
•	Evaluation of EvalOps and governance mechanisms;
•	Assessment of infrastructure scalability and orchestration behaviour;
•	Controlled commercial usage under defined subscription plans.
You acknowledge and agree that:
•	The Platform remains a Beta service and has not reached General Availability;
•	Features, capabilities, APIs, interfaces, workflows, and service structures may change without notice;
•	Certain operational safeguards, governance controls, and compliance capabilities remain under active development;
•	Platform behaviour, latency, orchestration logic, and infrastructure allocations may evolve during the Beta phase.
Nothing in these Terms constitutes:
•	A guarantee of future feature availability;
•	A commitment to maintain current pricing structures;
•	A guarantee of regulatory or industry-specific compliance unless expressly agreed in writing.
Estrel AI reserves the right to modify, suspend, restrict, or discontinue any part of the Beta Programme at its sole discretion.

3. Beta Status of the Platform
3.1 Beta Nature of the Platform
WiiZ 2.0 (Beta) remains a Beta platform unless otherwise stated.
Although commercial subscription plans are available, the Platform continues to operate in a controlled Beta environment intended for continuous refinement, operational validation, scaling, and feature evolution.
3.2 Platform Evolution
You acknowledge that:
•	Platform behaviour may evolve rapidly;
•	Features and workflows may change;
•	Credits logic may evolve;
•	Infrastructure allocations and limits may change;
•	Orchestration behaviour and reasoning systems may be refined continuously.
3.3 No General Availability Commitment
The Beta Programme does not create any obligation for Estrel AI Ltd to:
•	Launch a GA version;
•	Preserve existing features or pricing;
•	Maintain compatibility with existing workflows or integrations.

4. Eligibility, Registration, and Account Authority
4.1 Eligibility
You represent and warrant that:
•	You are legally authorised to enter into binding agreements;
•	Your usage complies with all applicable laws and regulations;
•	You possess all necessary authority to use the Platform.
4.2 Organisational Usage
If using the Platform on behalf of an organisation:
•	You represent that you are authorised to bind the organisation;
•	The organisation accepts responsibility for all actions performed through its tenancy and accounts.
4.3 Account Security
You are solely responsible for:
•	Credential confidentiality;
•	User access management;
•	Activity conducted under your accounts.
Estrel AI Ltd shall not be liable for losses arising from unauthorised access except where required by applicable law.

5. Subscription Plans and Service Tiers
5.1 General Structure
WiiZ 2.0 (Beta) is made available through multiple subscription plans during the Beta phase.
Subscription plans define:
•	Operational model;
•	Infrastructure allocation;
•	Support structures;
•	Storage and retention allocations;
•	Service levels;
•	Environment provisioning;
•	Credit allocations and execution capabilities.
Unless explicitly agreed otherwise in writing, the terms below constitute the default operational and support framework.

5.2 Starter Plan (WiiZ for Developer)
The Starter Plan, also referred to as “WiiZ for Developer”, is intended for:
•	Individual developers;
•	AI engineers;
•	Platform evaluators;
•	Developer communities;
•	Early-stage adopters seeking familiarity with the WiiZ ecosystem.
The intent of the Starter Plan is to support:
•	Community growth;
•	Initial platform understanding;
•	Experimental workflow orchestration;
•	AI orchestration prototyping.
Operational Model
The Starter Plan is provided strictly as a Software-as-a-Service (SaaS) offering.
Current hosting structure:
•	Primary Hosting Region: United Arab Emirates (UAE) 
•	Disaster Recovery (DR) Region: India
User and Collaboration Model
•	Unlimited collaborators may be added within a single developer tenancy;
•	The primary account owner remains responsible for sub-tenancy or collaborator administration and usage governance.
Platform Characteristics
Compared to higher service tiers, the Starter Plan includes:
•	Restricted compute allocation;
•	Shared queue-based orchestration processing;
•	Shared infrastructure execution environments;
•	Standardised Beta support mechanisms.
Starter Plan Limits
•	Python Executor Limit: 120 seconds per execution
•	File Storage: 5 GB per account
•	Vector Database Allocation: 2 GB per account
•	EvalOps and Audit Log Retention: 90 days
Support Model
Starter Plan support follows standard Beta support mechanisms.
Starter Plan SLA
•	Initial response target: within 5 business days from support request submission.
Third-Party Infrastructure and Service Dependency Disclaimer
Estrel AI Ltd provides the WiiZ 2.0 (Beta) Platform using a combination of internally managed services and third-party infrastructure, platform, orchestration, AI model, and cloud service providers (“Third-Party Providers”).
Accordingly, users acknowledge and agree that certain components of the Platform may depend on:
•	Cloud Service Providers (CSPs);
•	Large Language Model (LLM) providers;
•	AI model hosting providers;
•	Infrastructure hosting providers;
•	Networking and telecommunications providers;
•	Third-party APIs and integrations;
•	Customer-provisioned infrastructure or hosted environments;
•	Customer Bring Your Own (BYO) model deployments;
•	Customer-managed cloud or on-premises environments.
Where any downtime, degradation, interruption, latency, performance limitation, security incident, unavailability, operational failure, or service disruption arises directly or indirectly from such Third-Party Providers or customer-managed infrastructure, the applicable service levels, warranties, uptime commitments, response obligations, and operational limitations of the relevant third party shall apply.
In such circumstances:
•	Estrel AI Ltd SLAs shall not apply to the affected third-party dependent components;
•	Resolution timelines may remain dependent upon the respective third-party provider;
•	Estrel AI Ltd shall use commercially reasonable efforts to coordinate, support, escalate, or assist in remediation activities where operationally feasible;
•	Estrel AI Ltd shall not be liable for failures, outages, delays, degradation, inaccuracies, or interruptions attributable to third-party services or customer-managed infrastructure.
For WiiZ for Enterprise (WES), where infrastructure, hosting, networking, model serving, storage, orchestration layers, or operational environments are provisioned or managed by the customer or customer-designated providers, the customer remains solely responsible for the operational availability, maintenance, performance, security, and uptime of such infrastructure and associated dependencies.
Unless expressly stated otherwise in a separate written agreement, third-party provider SLAs shall govern all incidents attributable to such third-party systems or infrastructure dependencies.


5.3 WiiZ for Business (WBS)
WiiZ for Business (“WBS”) is intended for businesses and organisations requiring a SaaS-based enterprise operational model.
Hosting Structure
•	Primary Hosting Region: United Arab Emirates (UAE) or India as per Customer Final Contract agreement
•	Disaster Recovery (DR) Region: India
Platform Characteristics
Compared to the Starter Plan, WBS includes:
•	Reduced compute restrictions than WiiZ for Developer;
•	Organisation-prioritised orchestration queue handling;
•	Dedicated organizational tenancy segregation and The primary account owner remains responsible for sub-tenancy or collaborator administration and usage governance;
•	Extended execution flexibility.
WBS SaaS Hosted Limits and Allocations
•	Python Executor: No predefined execution limit currently applied
•	File Storage: 25 GB per account
•	Vector Database Allocation: 15 GB per account
•	EvalOps and Audit Log Retention: 90 days
Environment Provisioning
WBS environments include:
•	Test Environment
•	Production Environment
The Test Environment shall only be provisioned where the customer enters into a WiiZ Professional Services engagement agreement.

5.3.1 WBS Production Environment Service Levels (SLAs)
Severity Level	Description	Response Time	Resolution Target
Priority 1 - Critical	Platform unavailable or major production impact	≤ 1 hour	4-8 hours (workaround)
Priority 2 - High	Significant degradation affecting workflows	≤ 4 hours	1 business day
Priority 3 - Medium	Functional issue with limited impact	≤ 1 business day	3-5 business days
Priority 4 - Low - Service Requests	Informational or enhancement request	≤ 2 business days	Scheduled

5.3.2 WBS Production Support Operating Model
Tier 1 - Operational Support
This tier addresses day-to-day operational issues and system health concerns.
Includes:
•	Incident intake and triage;
•	Workflow execution errors;
•	Tool invocation failures;
•	Performance degradation alerts;
•	Monitoring dashboard support.
This tier focuses on operational stabilisation without architectural modification.
Tier 2 - Platform and Infrastructure Support
This tier focuses on platform integrity and configuration stability.
Includes:
•	Model serving optimisation;
•	Orchestration scaling guidance;
•	Performance tuning;
•	Reasoning refinement;
•	Integration troubleshooting.
Tier 2 support operates in collaboration with infrastructure and DevOps teams.
Tier 3 - Architectural and Strategic Support
This tier supports strategic capability evolution.
Includes:
•	New node design advisory;
•	Governance refinement;
•	EvalOps maturity enhancement;
•	Knowledge graph expansion strategy;
•	Roadmap alignment workshops.
This support structure positions Estrel AI Ltd as a strategic capability partner rather than solely a ticket-resolution provider.
WBS SLA Disclaimer
WBSTest and WBS Production SLAs, operational characteristics, limits, and components may vary based on final commercial agreements between organisations.
Where not explicitly overridden through contractual agreement, the provisions stated within these Terms shall apply by default.
Third-Party Infrastructure and Service Dependency Disclaimer
Estrel AI Ltd provides the WiiZ 2.0 (Beta) Platform using a combination of internally managed services and third-party infrastructure, platform, orchestration, AI model, and cloud service providers (“Third-Party Providers”).
Accordingly, users acknowledge and agree that certain components of the Platform may depend on:
•	Cloud Service Providers (CSPs);
•	Large Language Model (LLM) providers;
•	AI model hosting providers;
•	Infrastructure hosting providers;
•	Networking and telecommunications providers;
•	Third-party APIs and integrations;
•	Customer-provisioned infrastructure or hosted environments;
•	Customer Bring Your Own (BYO) model deployments;
•	Customer-managed cloud or on-premises environments.
Where any downtime, degradation, interruption, latency, performance limitation, security incident, unavailability, operational failure, or service disruption arises directly or indirectly from such Third-Party Providers or customer-managed infrastructure, the applicable service levels, warranties, uptime commitments, response obligations, and operational limitations of the relevant third party shall apply.
In such circumstances:
•	Estrel AI Ltd SLAs shall not apply to the affected third-party dependent components;
•	Resolution timelines may remain dependent upon the respective third-party provider;
•	Estrel AI Ltd shall use commercially reasonable efforts to coordinate, support, escalate, or assist in remediation activities where operationally feasible;
•	Estrel AI Ltd shall not be liable for failures, outages, delays, degradation, inaccuracies, or interruptions attributable to third-party services or customer-managed infrastructure.
For WiiZ for Enterprise (WES), where infrastructure, hosting, networking, model serving, storage, orchestration layers, or operational environments are provisioned or managed by the customer or customer-designated providers, the customer remains solely responsible for the operational availability, maintenance, performance, security, and uptime of such infrastructure and associated dependencies.
Unless expressly stated otherwise in a separate written agreement, third-party provider SLAs shall govern all incidents attributable to such third-party systems or infrastructure dependencies.


5.4 WiiZ for Enterprise (WES)
WiiZ for Enterprise (“WES”) is intended for businesses and organisations requiring:
•	On-premises deployment;
•	Self-hosted infrastructure;
•	Dedicated organizational tenancy segregation and The primary account owner remains responsible for sub-tenancy or collaborator administration and usage governance;
•	Private infrastructure orchestration;
•	Enterprise-controlled operational environments.
Infrastructure Responsibility
Infrastructure provisioning, hosting, management, scaling, networking, security hardening, monitoring, backup, and operational maintenance remain solely the responsibility of the customer.
In this case Estrel AI Ltd provides Software platform-level support only for:
•	Bug fixes;
•	Minor enhancements;
•	Platform operational guidance.

5.4.1 WES Production Environment Service Levels (SLAs)
Severity Level	Description	Response Time	Resolution Target
Priority 1 - Critical	Platform unavailable or major production impact	≤ 1 hour	4-8 hours (workaround)
Priority 2 - High	Significant degradation affecting workflows	≤ 4 hours	1 business day
Priority 3 - Medium	Functional issue with limited impact	≤ 1 business day	3-5 business days
Priority 4 - Low - Service Requests	Informational or enhancement request	≤ 2 business days	Scheduled

5.4.2 WES Production Support Operating Model
Tier 1 - Operational Support
Includes:
•	Incident intake and triage;
•	Workflow execution errors;
•	Tool invocation failures;
•	Performance degradation alerts;
•	Monitoring dashboard support.
Tier 2 - Platform and Infrastructure Support
Includes:
•	Model serving optimisation;
•	Orchestration scaling guidance;
•	Performance tuning;
•	Reasoning refinement;
•	Integration troubleshooting.
Tier 3 - Architectural and Strategic Support
Includes:
•	New node design advisory;
•	Governance refinement;
•	EvalOps maturity enhancement;
•	Knowledge graph expansion strategy;
•	Roadmap alignment workshops.
WES SLA Disclaimer
All WES environment SLAs, operational characteristics, limits, and components may vary based on final contractual agreements.
Where not explicitly overridden through written agreement, these Terms shall apply by default.

6. Credits, Usage Measurement, and Resource Consumption
6.1 Credit-Based Usage Model
Platform usage is measured through Credits.
Credits are consumed based on workflow orchestration activity, iteration processing, AI responses, and platform execution behaviour.

6.2 Workflow Credit Logic
Standard Workflow Execution
One (1) Credit shall be charged for each complete end-to-end workflow process execution.
Workflow Iteration Processing
Where workflows contain iterative execution behaviour, loops, recursive processing, or repeated iteration modes:
•	One (1) additional Credit shall be charged for each iteration processed within the workflow.
The total workflow Credit consumption shall therefore include:
•	Base workflow execution Credits; and
•	Iteration execution Credits.

6.3 Intent Studio Credit Logic
One (1) Credit shall be charged for every AI-generated response transaction occurring within Intent Studio.
Credits are consumed per AI-generated outbound response irrespective of:
•	Conversation success;
•	Output quality;
•	Completion state;
•	User satisfaction.

6.4 Future Credit Expansion
Estrel AI Ltd reserves the right to introduce additional Credit-based charging structures for:
•	WiiZ for Business user interfaces;
•	Python Executor environments;
•	EvalOps capabilities;
•	Advanced orchestration tooling;
•	Future enterprise capabilities.
Such additions may be introduced through updated Beta Terms and Conditions or separate commercial agreements.

6.5 Resource Limits
Unless otherwise contractually agreed:
Starter Plan
•	File Storage: 5 GB
•	Vector Database: 2 GB
WBS Plan
•	File Storage: 25 GB
•	Vector Database: 15 GB
Additional limits may be introduced or modified during the Beta phase.

7. Billing, Payments, and Subscription Management
7.1 Subscription Billing
Paid plans are provided on recurring subscription terms.
Billing cycles may include:
•	Monthly billing;
•	Annual billing;
•	Custom enterprise commercial arrangements.
7.2 Payment Authorisation
By subscribing to paid plans, you authorise Estrel AI Ltd to:
•	Process recurring subscription charges;
•	Automatically debit payment methods;
•	Process applicable taxes and commercial charges.
7.3 Plan Modifications
Estrel AI Ltd may:
•	Modify pricing;
•	Adjust Credits allocations;
•	Introduce new commercial plans;
•	Change operational characteristics;
•	Modify support structures.
Changes may occur during the Beta phase without obligation to preserve current structures.
7.4 Non-Payment
Failure to maintain valid payment arrangements may result in:
•	Suspension of workflow execution;
•	Suspension of Intent Studio transactions;
•	Restriction of tenancy access;
•	Data retention limitations.

8. Acceptable Use and Platform Restrictions
You agree not to:
•	Violate applicable laws or regulations;
•	Attempt to bypass Credits enforcement mechanisms;
•	Reverse engineer the Platform;
•	Introduce malicious code;
•	Abuse orchestration systems;
•	Misrepresent AI-generated outputs;
•	Perform unauthorised security testing.
You remain solely responsible for all workflows, outputs, prompts, and orchestration behaviour created within your tenancy.

9. User Content, Data Handling, and Storage
You retain ownership of your User Content.
You acknowledge and agree that:
•	The Platform remains in Beta;
•	Certain operational controls remain under refinement;
•	Data protection and governance mechanisms continue evolving;
•	You should avoid uploading highly sensitive or regulated information unless contractually agreed.
Estrel AI Ltd may:
•	Store and process User Content for operational purposes;
•	Use anonymised operational telemetry for platform improvement;
•	Apply retention limits and operational restrictions.
Data persistence during Beta is not guaranteed.

10. Feedback and Platform Improvements
Feedback provided during the Beta phase may be used by Estrel AI Ltd for:
•	Platform enhancement;
•	Feature development;
•	Operational optimisation;
•	Commercial evolution.
All platform improvements derived from Beta feedback shall remain the exclusive property of Estrel AI Ltd.

11. Intellectual Property Rights
Estrel AI Ltd retains all rights, title, and interest in:
•	The WiiZ platform;
•	Orchestration engines;
•	AI models;
•	Governance layers;
•	EvalOps systems;
•	Platform architecture;
•	APIs and integrations.
Except for the limited usage rights granted under these Terms, no ownership rights are transferred to users.

12. Confidentiality
Users agree to maintain confidentiality regarding:
•	Non-public platform architecture;
•	Operational structures;
•	Commercial information;
•	Roadmaps;
•	Security mechanisms;
•	Beta platform behaviour.
Confidentiality obligations survive termination of access.

13. Data Privacy and Security
The Platform remains a Beta environment.
Accordingly:
•	Security controls continue evolving;
•	Operational safeguards continue maturing;
•	Certain compliance capabilities may not yet be fully implemented.
You remain responsible for ensuring lawful processing of all uploaded data.
Estrel AI Ltd does not warrant compliance with any specific regulatory framework unless expressly agreed in writing.

14. Service Levels and Operational Support
14.1 Scope
Service levels apply to WiiZ-managed operational capabilities including:
•	Vector databases;
•	Relational databases;
•	Embedding models;
•	Reasoning systems;
•	EvalOps tooling;
•	Guardrail systems;
•	Speech and vision services.
14.2 Beta Availability
The Platform is provided on a commercially reasonable best-effort basis during Beta.
No guaranteed uptime percentages apply unless contractually agreed.
14.3 No Service Credits
Unless explicitly stated in enterprise agreements:
•	Downtime credits;
•	Penalty structures;
•	Refund obligations
shall not apply during the Beta phase.

15. AI Output Responsibility
You acknowledge that:
•	AI outputs may be inaccurate, incomplete, outdated, biased, or misleading;
•	Human review and validation remain mandatory;
•	Outputs must not be solely relied upon for legal, medical, financial, safety-critical, or regulatory decisions.
You remain solely responsible for all reliance placed upon Platform outputs.

16. Disclaimers and No Warranties
To the maximum extent permitted by applicable law, the Platform is provided strictly on an “as is” and “as available” basis.
Estrel AI Ltd disclaims all warranties including:
•	Merchantability;
•	Fitness for a particular purpose;
•	Non-infringement;
•	Output accuracy;
•	Availability guarantees;
•	Operational continuity.
The Platform may:
•	Experience outages;
•	Produce inaccurate outputs;
•	Undergo operational changes;
•	Experience degraded performance;
•	Be modified or discontinued without notice.

17. Limitation of Liability
As the system is currently in Beta No Liabilities shall apply on Estrel AI Ltd at any time of the engagement:
•	Estrel AI Ltd shall not be liable for indirect, incidental, special, or consequential damages;
•	Liability for data loss, operational interruption, workflow failure, or AI decision outcomes is excluded;
•	No Aggregate liability shall apply on Estrel AI Ltd.

18. Governing Law and Jurisdiction
These Terms shall be governed by the laws of the Dubai International Financial Centre (DIFC).
The DIFC Courts shall possess exclusive jurisdiction over disputes arising under these Terms.

19. Miscellaneous
19.1 Entire Agreement
These Terms constitute the complete agreement governing use of the Platform.
19.2 Assignment
Users may not assign rights under these Terms without prior written consent.
19.3 Severability
Invalid provisions shall not affect the enforceability of remaining provisions.
19.4 Force Majeure
Estrel AI Ltd shall not be liable for delays or failures arising from events beyond reasonable control.

20. Acceptance
By accessing or using the Platform, you acknowledge that:
•	You have read and understood these Terms;
•	You agree to be bound by these Terms;
•	The Platform remains a Beta service;
•	Platform behaviour, Credits structures, operational limits, and commercial models may evolve during the Beta phase;
•	Participation remains voluntary and at your own risk.
If you do not agree to these Terms, you must not access or use the Platform.
`;

const privacyContent = `Privacy Policy - WiiZ 2.0 (Beta)
Policy Version: 2.0
Last Updated: 14 May 2026

1. Introduction
Estrel AI Ltd ("Estrel AI", "we", "us", or "our"), a company incorporated in the Dubai International Financial Centre (DIFC), is committed to protecting personal data and respecting user privacy in accordance with applicable data protection laws and industry-aligned governance standards.
This Privacy Policy explains how Estrel AI Ltd collects, processes, stores, uses, transfers, discloses, and protects personal data in connection with:
•	WiiZ 2.0 (Beta);
•	WiiZ for Developer;
•	WiiZ for Business (WBS);
•	WiiZ for Enterprise (WES);
•	https://hub.wiiz.it;
•	https://wbs.wiiz.it;
•	www.wiiz.it;
•	associated APIs, orchestration systems, Intent Studio, EvalOps tooling, Python execution environments, integrations, support channels, and related services (collectively, the “Platform”).
This Privacy Policy applies to:
•	Website visitors;
•	Platform users;
•	Organisational customers;
•	Enterprise customers;
•	Developers;
•	Beta programme participants;
•	Authorised users accessing the Platform through organisational or enterprise tenancies.
This Privacy Policy should be read together with:
•	WiiZ 2.0 (Beta) Terms and Conditions;
•	WiiZ Cookie Policy;
•	Applicable contractual agreements executed between Estrel AI Ltd and customers.

2. Regulatory and Legal Framework
Estrel AI Ltd operates within the Dubai International Financial Centre (DIFC) and processes personal data in accordance with:
•	DIFC Data Protection Law No. 5 of 2020;
•	Applicable DIFC regulations and guidance;
•	Contractual privacy obligations;
•	Commercially reasonable data governance and security practices.
Where personal data is processed outside the DIFC or UAE, Estrel AI Ltd implements commercially reasonable safeguards appropriate to the nature of the processing activities and operational infrastructure.

3. Beta Nature of the Platform
WiiZ 2.0 currently operates in a Beta (pre-General Availability) environment.
Accordingly:
•	Certain operational controls, orchestration systems, analytics mechanisms, governance layers, and security processes remain under active development and refinement;
•	Platform behaviour, orchestration logic, AI workflows, analytics systems, and operational telemetry mechanisms may evolve during the Beta phase;
•	Certain operational processes may be modified, interrupted, reset, migrated, refined, or updated as part of platform improvement activities;
•	Certain governance and compliance controls may continue maturing throughout the Beta lifecycle.
Although commercial subscription plans are available, the Platform remains a Beta environment intended for continuous improvement, controlled adoption, operational validation, scalability testing, and feature evolution.

4. Categories of Personal Data We Collect
4.1 Information Provided Directly by Users
We may collect personal data voluntarily submitted by users including:
•	Full name;
•	Email address;
•	Organisation or company name;
•	Professional designation or role;
•	Contact details;
•	Authentication credentials and account registration information;
•	Subscription and billing information;
•	Support requests and operational communications;
•	Feedback submissions;
•	Uploaded files and operational content;
•	Workflow configurations and orchestration data;
•	Intent Studio prompts and interactions;
•	EvalOps-related submissions;
•	User-generated operational content.

4.2 Information Collected Automatically
When users access the Platform or associated websites, certain information may be collected automatically including:
•	IP address;
•	Browser type and version;
•	Device identifiers;
•	Operating system information;
•	Session identifiers;
•	Platform interaction events;
•	Workflow execution telemetry;
•	API interaction metadata;
•	Diagnostic and performance logs;
•	Infrastructure monitoring data;
•	Security events and authentication logs;
•	Platform navigation behaviour;
•	Approximate geographic region;
•	Referral and session activity information.

4.3 Analytics and Event Telemetry
The Platform may utilise analytics and telemetry technologies including:
•	Google Analytics;
•	Google Tag Manager;
•	Google Global Site Tag (gtag.js);
•	Infrastructure monitoring systems;
•	Operational telemetry services;
•	Usage analytics tools;
•	Security and monitoring platforms.
These systems may capture operational and usage-related events including:
•	Page visits and navigation behaviour;
•	Feature interactions;
•	Workflow execution behaviour;
•	Intent Studio usage patterns;
•	Session activity;
•	User interaction telemetry;
•	Platform performance metrics;
•	Reliability and operational diagnostics.
These analytics and telemetry systems are used for:
•	Platform optimisation;
•	Security and operational monitoring;
•	Product improvement;
•	Infrastructure reliability;
•	Usage analysis;
•	Beta programme refinement;
•	Commercial and operational analytics.

4.4 Sensitive and Restricted Data
Unless expressly authorised through separate contractual agreements, users should avoid uploading or processing:
•	Special category personal data;
•	Health information;
•	Government-regulated data;
•	Financial account credentials;
•	Authentication secrets or passwords;
•	Highly confidential enterprise datasets;
•	Regulated sector-specific information.
Submission of such information remains solely at the user's discretion and risk.
Estrel AI Ltd disclaims responsibility for prohibited or unauthorised sensitive data uploaded in violation of this Policy.

5. How We Use Personal Data
Estrel AI Ltd may process personal data for the following purposes:
•	Operating and administering the Platform;
•	Providing orchestration and AI execution capabilities;
•	Managing subscriptions, accounts, and tenancy structures;
•	Enabling workflow orchestration functionality;
•	Supporting Intent Studio interactions;
•	Managing customer onboarding and operational provisioning;
•	Providing technical and operational support;
•	Monitoring platform health and infrastructure reliability;
•	Detecting abuse, fraud, misuse, or security incidents;
•	Supporting analytics and telemetry processing;
•	Improving platform functionality and orchestration performance;
•	Supporting EvalOps processing and operational governance;
•	Managing billing and commercial operations;
•	Complying with legal, regulatory, contractual, and governance obligations;
•	Supporting Beta programme enhancement and operational maturity.
We do not intentionally use personal data for materially incompatible purposes unless otherwise permitted by law or contractually authorised.

6. Legal Basis for Processing
Where applicable under relevant laws, Estrel AI Ltd processes personal data on one or more of the following legal bases:
•	Performance of contractual obligations;
•	Legitimate business interests;
•	Operational and security requirements;
•	Compliance with legal obligations;
•	Consent, where required;
•	Protection of platform integrity, operational infrastructure, users, and services.
Legitimate interests may include:
•	Platform optimisation;
•	Operational governance;
•	Security monitoring;
•	Abuse prevention;
•	Infrastructure reliability;
•	Product enhancement;
•	Usage analytics;
•	Beta programme refinement.

7. Cookies and Tracking Technologies
The Platform uses cookies and related technologies as described in the WiiZ Cookie Policy.
These technologies may support:
•	Session continuity and authentication;
•	Security and fraud prevention;
•	Workflow persistence;
•	Operational analytics;
•	Event telemetry;
•	Platform performance optimisation;
•	Product improvement and Beta analysis.
The Platform may implement Google tags and analytics technologies including gtag.js for event capture, telemetry analysis, and platform usage optimisation.
Users may manage cookies through browser settings or applicable consent mechanisms.
Disabling certain cookies may impact platform functionality, session continuity, workflow behaviour, or analytics visibility.

8. AI Processing and Operational Telemetry
Users acknowledge that prompts, orchestration inputs, workflow configurations, execution telemetry, Intent Studio interactions, and operational metadata may be processed through AI systems and orchestration engines to provide requested services.
Operational telemetry and orchestration metadata may be processed for:
•	Workflow execution;
•	Platform reliability;
•	Infrastructure monitoring;
•	Error detection and remediation;
•	EvalOps processing;
•	Security analysis;
•	Performance optimisation;
•	Operational governance;
•	Product enhancement and Beta refinement.
Certain telemetry data may be aggregated, anonymised, or operationally analysed for analytics and service improvement purposes.

9. Organisational and Enterprise Tenancy Structures
Where the Platform is accessed through organisational or enterprise tenancy structures:
•	Organisational administrators may possess administrative visibility and operational management capabilities relating to authorised users;
•	Organisations may manage user provisioning, permissions, tenancy governance, and operational controls;
•	Enterprise customers remain responsible for lawful internal use of the Platform;
•	Estrel AI Ltd operates independently as the platform provider unless otherwise contractually agreed.
The primary account owner may remain responsible for collaborator administration, sub-tenancy governance, and organisational access management.

10. Data Sharing and Disclosure
Estrel AI Ltd does not sell personal data.
Personal data may be shared in limited circumstances including:
•	Infrastructure hosting providers;
•	Cloud and platform service providers;
•	Analytics and telemetry providers;
•	Authentication and identity providers;
•	Security, monitoring, and anti-abuse providers;
•	Professional advisers and auditors;
•	Legal or regulatory authorities;
•	Corporate affiliates or restructuring entities;
•	Enterprise customers where organisational tenancy structures apply.
All sharing activities are subject to commercially reasonable operational, contractual, or legal safeguards where appropriate.

11. International Data Transfers
The Platform may operate across multiple jurisdictions including:
•	United Arab Emirates (UAE);
•	India;
•	Additional authorised infrastructure regions utilised by operational providers.
Personal data may therefore be transferred to or processed outside the DIFC or UAE.
Where applicable, Estrel AI Ltd implements commercially reasonable safeguards intended to protect transferred personal data.

12. Data Retention
Personal data is retained only for as long as reasonably necessary to:
•	Provide the Platform and related services;
•	Fulfil contractual obligations;
•	Support operational and security requirements;
•	Maintain auditability and governance;
•	Comply with legal obligations;
•	Support Beta platform refinement and infrastructure analysis.
During the Beta phase:
•	Data retention periods may evolve;
•	Certain operational data may be reset, anonymised, archived, migrated, or deleted;
•	Telemetry and analytics information may be retained for operational optimisation and product improvement purposes.
Unless otherwise contractually agreed:
•	EvalOps and audit logs may be retained for approximately ninety (90) days depending on service tier, infrastructure allocation, and operational requirements.

13. Data Security
Estrel AI Ltd implements commercially reasonable technical and organisational measures intended to protect personal data including measures relating to:
•	Authentication;
•	Access control;
•	Infrastructure security;
•	Operational monitoring;
•	Incident management;
•	Governance and auditability;
•	Security event analysis.
However:
•	No system can be guaranteed fully secure;
•	The Platform remains in Beta;
•	Certain security mechanisms continue evolving during the Beta phase.
Users acknowledge that use of AI orchestration platforms involves inherent operational and technological risks.

14. User Rights
Subject to applicable law, users may possess rights including:
•	Access to personal data;
•	Correction of inaccurate information;
•	Deletion requests;
•	Restriction of processing;
•	Objection to certain processing activities;
•	Withdrawal of consent where applicable;
•	Data portability where legally required.
Requests may be submitted using the contact information below.
Estrel AI Ltd may require identity verification before responding to requests.
Certain rights may be restricted where retention or processing is required for:
•	Security;
•	Legal compliance;
•	Operational governance;
•	Platform integrity;
•	Contractual obligations;
•	Legitimate business interests.

15. Third-Party Services and Integrations
The Platform may integrate with third-party systems including:
•	Cloud infrastructure providers;
•	AI model providers;
•	Authentication systems;
•	Analytics providers;
•	Enterprise integrations;
•	External APIs and connectors.
Estrel AI Ltd is not responsible for the independent privacy practices of third-party services operating outside the Platform.
Users should review applicable third-party privacy policies where relevant.

16. Children's Privacy
The Platform is not intended for individuals under eighteen (18) years of age.
Estrel AI Ltd does not knowingly collect personal data from children.
Where unauthorised data relating to minors is identified, Estrel AI Ltd may delete such information.

17. Changes to This Privacy Policy
Estrel AI Ltd reserves the right to modify or update this Privacy Policy at any time.
Updated versions may be published through:
•	www.wiiz.it;
•	Platform interfaces;
•	Operational communications;
•	Organisational notices.
Continued use of the Platform following publication of updates constitutes acceptance of the revised Privacy Policy.

18. Contact Information
For privacy-related questions, requests, or concerns, users may contact:
Estrel AI Ltd
Dubai International Financial Centre (DIFC)
Dubai, United Arab Emirates
Website: https://www.wiiz.it
Platform: https://hub.wiiz.it
Email: support.wiiz@estrel.ai

19. Acknowledgement
By accessing or using the Platform, users acknowledge that:
•	They have read and understood this Privacy Policy;
•	Personal data may be processed as described herein;
•	The Platform operates in a Beta environment;
•	Operational telemetry, analytics systems, cookies, event capture systems, AI orchestration engines, and monitoring mechanisms may process interaction and usage information;
•	Platform functionality, orchestration systems, governance mechanisms, analytics technologies, operational controls, and service structures may evolve during the Beta phase.
If users do not agree with this Privacy Policy, they should discontinue use of the Platform.`;

const cookieContent = `Cookie Policy - WiiZ 2.0 (Beta)
Policy Version: 1.0
Last Updated: 14 May 2026

1. Introduction
This Cookie Policy explains how Estrel AI Ltd (“Estrel AI”, “we”, “us”, or “our”) uses cookies, tracking technologies, and similar data collection mechanisms in connection with:
•	WiiZ 2.0 (Beta);
•	WiiZ for Developer;
•	WiiZ for Business (WBS);
•	WiiZ for Enterprise (WES);
•	https://hub.wiiz.it;
•	https://wbs.wiiz.it;
•	www.wiiz.it; and.
•	related websites, applications, and platform interfaces (collectively, the “Platform”).
This Cookie Policy should be read together with the WiiZ Terms and Conditions and Privacy Policy.
By continuing to use the Platform, you acknowledge and agree to the use of cookies and similar technologies in accordance with this Policy, subject to applicable law and consent requirements.

2. What Are Cookies
Cookies are small text files placed on your browser, device, or system when you visit a website or use a platform.
Cookies may:
•	Remember user preferences;
•	Maintain login sessions;
•	Improve platform functionality;
•	Enable analytics and performance monitoring;
•	Support security and fraud prevention;
•	Help understand user interaction and feature usage.
Cookies may be:
•	Session Cookies — deleted when the browser session ends; or
•	Persistent Cookies — retained until expiry or manual deletion.

3. Types of Cookies We Use
3.1 Strictly Necessary Cookies
These cookies are essential for operation of the Platform and cannot be disabled through our systems.
They may include:
•	Authentication and login session management;
•	Security and fraud prevention;
•	Load balancing;
•	Platform stability and routing;
•	API session continuity;
•	Infrastructure integrity controls.
Without these cookies, portions of the Platform may not function properly.

3.2 Functional Cookies
Functional cookies enable enhanced functionality and personalization.
These may include:
•	Language preferences;
•	User interface settings;
•	Theme and layout preferences;
•	Workflow configuration persistence;
•	Platform usability enhancements.
Disabling these cookies may impact user experience.

3.3 Analytics and Performance Cookies
We use analytics technologies, including Google technologies such as Google Analytics and Google Global Site Tag (“gtag.js”), to understand Platform usage and improve performance.
These cookies may collect information relating to:
•	Pages visited;
•	Session duration;
•	Feature interactions;
•	Workflow activity patterns;
•	Navigation behaviour;
•	Device and browser information;
•	Geographic region (approximate);
•	Platform performance metrics;
•	Event interactions and telemetry.
These analytics technologies help us:
•	Improve platform usability;
•	Understand adoption of features;
•	Optimize workflows and orchestration performance;
•	Measure operational reliability;
•	Improve customer experience;
•	Support product development and Beta platform refinement.

4. Google Tags and Event Tracking
The Platform may use Google tags, including but not limited to:
•	Google Analytics;
•	Google Tag Manager;
•	Google Global Site Tag (gtag.js);
•	Google Ads conversion tracking;
•	Event telemetry integrations.
These technologies may capture certain interaction events including:
•	Page visits;
•	Session activity;
•	Feature engagement;
•	Button clicks;
•	Workflow execution interactions;
•	Intent Studio interactions;
•	User journey analytics;
•	Platform performance behaviour.
These tracking technologies are used solely for operational analytics, performance optimization, product improvement, marketing effectiveness measurement, and platform experience enhancement.
We do not intentionally use Google tags to capture highly sensitive personal information, authentication credentials, payment information, or confidential enterprise workflow data.
Users remain responsible for ensuring they do not intentionally input prohibited or sensitive data into publicly tracked fields.

5. Third-Party Cookies
Certain third-party providers integrated into the Platform may place cookies or tracking technologies on your device.
These may include:
•	Google services;
•	Authentication providers;
•	Infrastructure monitoring tools;
•	Customer support platforms;
•	Security and anti-abuse systems;
•	Embedded integrations.
Third-party providers operate under their own privacy and cookie policies.
Estrel AI Ltd does not control third-party cookie behaviour beyond the integrations explicitly implemented within the Platform.

6. Cookie Consent
Where required by applicable law, the Platform may request user consent before placing non-essential cookies or analytics technologies.
Users may:
•	Accept cookies;
•	Reject non-essential cookies;
•	Modify cookie preferences;
•	Withdraw consent at any time through browser settings or cookie preference mechanisms where available.
Certain Platform features may not function correctly if cookies are disabled.

7. Browser and Device Controls
Most browsers allow users to:
•	View stored cookies;
•	Delete cookies;
•	Block cookies;
•	Restrict third-party cookies;
•	Configure cookie permissions.
Browser settings vary by provider and device type.
Disabling certain cookies may impact Platform functionality, login persistence, workflow continuity, or analytics behaviour.

8. Data Collected Through Cookies
Cookies and tracking technologies may process limited information including:
•	IP address;
•	Device identifiers;
•	Browser type;
•	Operating system;
•	Session identifiers;
•	Usage behaviour;
•	Platform interactions;
•	Referring URLs;
•	Approximate geographic region.
Such data may be combined with operational telemetry and analytics systems for platform optimization and security purposes.

9. Data Retention
Cookie-related data retention periods may vary depending on:
•	Cookie type;
•	Browser settings;
•	Analytics provider configuration;
•	Security requirements;
•	Operational and legal obligations.
Certain analytics and telemetry data may be retained for platform improvement, auditability, operational analysis, and Beta programme refinement.

10. Security and Beta Disclaimer
The Platform remains in Beta.
Accordingly:
•	Certain analytics systems and telemetry mechanisms may evolve;
•	Tracking technologies may change during the Beta phase;
•	Cookie implementation and consent mechanisms may continue maturing over time.
Estrel AI Ltd implements commercially reasonable measures to protect analytics and telemetry data but does not guarantee uninterrupted security or error-free operation during Beta.

11. International Data Transfers
Certain analytics providers, including Google services, may process data outside your country of residence.
By using the Platform, you acknowledge that certain cookie-related data may be transferred to and processed in jurisdictions with different data protection standards.
Where required, Estrel AI Ltd will implement commercially reasonable safeguards appropriate to the nature of the services provided.

12. Changes to This Cookie Policy
Estrel AI Ltd reserves the right to modify this Cookie Policy at any time.
Updated versions will be published through the Platform or associated websites.
Continued use of the Platform after updates constitutes acceptance of the revised Cookie Policy.

13. Contact Information
For questions relating to this Cookie Policy, users may contact:
Estrel AI Ltd
Dubai International Financial Centre (DIFC)
United Arab Emirates
Website: https://www.wiiz.it
Platform: https://hub.wiiz.it

14. Acceptance
By accessing or using the Platform, you acknowledge that:
•	You have read and understood this Cookie Policy;
•	You consent to the use of cookies and related technologies as described herein, where permitted by applicable law;
•	You understand that analytics and event tracking technologies, including Google tags and gtag.js integrations, may be used during the Beta phase of the Platform.
If you do not agree with this Cookie Policy, you should discontinue use of the Platform or disable cookies through your browser settings where appropriate.

`;

export const policyRegistry: Record<PolicyKey, PolicyEntry> = {
  terms: {
    title: "Terms and Conditions",
    content: termsContent,
  },
  privacy: {
    title: "Privacy Policy",
    content: privacyContent,
  },
  cookies: {
    title: "Cookie Policy",
    content: cookieContent,
  },
};

export function renderPolicyContent(content: string): ReactNode {
  return content.split("\n\n").map((paragraph, index) => {
    const trimmedParagraph = paragraph.trim();

    if (!trimmedParagraph) {
      return null;
    }

    const lines = trimmedParagraph.split("\n").filter(Boolean);
    const isHeading =
      lines.length === 1 &&
      /^(?:\d+(?:\.\d+)*\.?|Conclusion and Acceptance|Last Updated:)/.test(
        lines[0]
      );

    if (isHeading) {
      const isPrimaryHeading =
        /^\d+\./.test(lines[0]) || lines[0] === "Conclusion and Acceptance";

      return (
        <h3
          key={`${lines[0]}-${index}`}
          className={
            isPrimaryHeading
              ? "mt-7 text-xl font-semibold text-white md:text-2xl"
              : "mt-5 text-lg font-semibold text-white md:text-xl"
          }
        >
          {lines[0]}
        </h3>
      );
    }

    return (
      <div key={`paragraph-${index}`} className="space-y-0 md:space-y-2">
        {lines.map((line, lineIndex) => {
          const displayLine = line.replace(/^•\s*/, "");
          const isPointerLine =
            /^•\s*/.test(line) ||
            /;$/.test(line) ||
            /:$/.test(line) ||
            /^(?:[A-Z][A-Za-z0-9\s"()/.-]+)$/.test(line);

          if (isPointerLine) {
            return (
              <div
                key={`${index}-${lineIndex}`}
                className="flex items-start gap-2"
              >
                <span className="mt-3 md:h-2 h-1.5 md:w-2 w-1.5 flex-shrink-0 rounded-full bg-secondary" />
                <p className="text-sm md:text-base md:leading-8 text-gray-200">
                  {displayLine}
                </p>
              </div>
            );
          }

          return (
            <Fragment key={`${index}-${lineIndex}`}>
              <p className="text-sm md:leading-7 text-gray-300 md:text-[16px]">
                {displayLine}
              </p>
            </Fragment>
          );
        })}
      </div>
    );
  });
}
