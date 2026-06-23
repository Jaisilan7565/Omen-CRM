const db = require('../src/database/models');
const contactsService = require('../src/modules/contacts/contacts.service');
const accountsService = require('../src/modules/accounts/accounts.service');
const kycService = require('../src/modules/kyc/kyc.service');

async function seedDummyData() {
  try {
    // 1. Authenticate connection
    await db.sequelize.authenticate();
    console.log('Database connection established successfully.');

    // 2. Clear Database except Platform Admin (email: 'jaisilan@gmail.com')
    console.log('\n--- Cleaning Database ---');
    
    // Find platform admin
    const platformAdmin = await db.Contact.findOne({ where: { email: 'jaisilan@gmail.com' } });
    if (!platformAdmin) {
      console.log('Platform Admin not found. Please run seed:admin first.');
      if (require.main === module) {
        process.exit(1);
      } else {
        throw new Error('Platform Admin not found. Please run seed:admin first.');
      }
    }
    const adminId = platformAdmin.id;

    // Delete Kyc records
    await db.Kyc.destroy({ where: {} });
    console.log('KYC records cleared.');

    // Delete Account records
    await db.Account.destroy({ where: {} });
    console.log('Account records cleared.');

    // Delete Contacts except Platform Admin
    await db.Contact.destroy({
      where: {
        id: { [db.Sequelize.Op.ne]: adminId }
      }
    });
    console.log('Contact records cleared (except Platform Admin).');

    // 3. Seed Contacts (Internal Directory / Staff List)
    console.log('\n--- Seeding Contacts ---');
    const contactsToCreate = [
      {
        fullName: 'Alice Walker',
        email: 'alice.walker@techglora.com',
        phone: '+91 98765 43210',
        employeeId: 'EMP-001',
        designation: 'Director of Business Development',
        department: 'Sales',
        timezone: 'Asia/Kolkata',
        language: 'English',
        location: 'Bengaluru, India',
        linkedinUrl: 'https://linkedin.com/in/alicewalker-sales',
        bio: 'Over 12 years of enterprise sales experience across SaaS and cloud offerings.',
        status: 'active'
      },
      {
        fullName: 'Bob Vance',
        email: 'bob.vance@techglora.com',
        phone: '+1 570 555 0109',
        employeeId: 'EMP-002',
        designation: 'Senior Account Executive',
        department: 'Sales',
        timezone: 'America/New_York',
        language: 'English',
        location: 'Scranton, USA',
        linkedinUrl: 'https://linkedin.com/in/bobvance-refrigeration',
        bio: 'Specialist in mid-market accounts, partnership programs, and logistics.',
        status: 'active'
      },
      {
        fullName: 'Charlie Green',
        email: 'charlie.green@techglora.com',
        phone: '+91 99988 77766',
        employeeId: 'EMP-003',
        designation: 'Pre-Sales Technical Lead',
        department: 'Engineering',
        timezone: 'Asia/Kolkata',
        language: 'English',
        location: 'Bengaluru, India',
        linkedinUrl: 'https://linkedin.com/in/charliegreen-presales',
        bio: 'Solution architect specializing in database replication, cloud migrations, and security architectures.',
        status: 'active'
      }
    ];

    const seededContacts = [];
    for (const c of contactsToCreate) {
      const dbContact = await contactsService.create(c);
      console.log(`Contact (Staff) ${dbContact.fullName} (${dbContact.email}) created.`);
      seededContacts.push(dbContact);
    }

    const aliceContact = seededContacts.find(c => c.email === 'alice.walker@techglora.com') || seededContacts[0];
    const bobContact = seededContacts.find(c => c.email === 'bob.vance@techglora.com') || seededContacts[0];

    // 4. Seed Accounts
    console.log('\n--- Seeding Accounts ---');
    
    const accountsToCreate = [
      {
        name: 'TechGlora Solutions Ltd',
        ownerId: aliceContact.id,
        accountType: 'Customer',
        industry: 'IT/ITES',
        status: 'active',
        category: 'Key Client',
        organizationProfile: 'Enterprise',
        subIndustry: 'Cloud Consulting',
        website: 'https://techglora.com',
        linkedinPage: 'https://linkedin.com/company/techglora',
        yearEstablished: 2018,
        employeeSize: '201-500',
        annualRevenueRange: '$10M - $50M',
        marketSegment: 'Enterprise',
        employees: 350,
        officesCount: 4,
        globalPresence: true,
        countriesOperation: ['India', 'United States', 'Singapore'],
        gstNumber: '29AAAAA1111A1Z1',
        panNumber: 'AAAAA1111A',
        cinNumber: 'U72200KA2018PTC111111',
        paymentTerms: 'Net 30',
        creditLimit: 50000,
        taxExemptionStatus: false,
        billingStreet: '100 Tech Park, Whitefield',
        billingStreet2: 'Block A, 4th Floor',
        billingCity: 'Bengaluru',
        billingState: 'Karnataka',
        billingCountry: 'India',
        billingZip: '560066',
        shippingLocation: 'Head Office Bangalore',
        shippingStreet: '100 Tech Park, Whitefield',
        shippingCity: 'Bengaluru',
        shippingCountry: 'India',
        shippingPhone: '+91 80 1234 5678',
        primaryContactName: 'John Doe',
        primaryContactDesignation: 'VP of Procurement',
        primaryContactDepartment: 'Operations',
        primaryContactEmail: 'john.doe@techglora.com',
        primaryContactMobile: '+91 9988776655',
        primaryContactPhone: '+91 80 8765 4321',
        primaryContactLinkedin: 'https://linkedin.com/in/johndoe-procurement',
        cloudProvider: 'AWS',
        dataCentreProvider: 'AWS Mumbai',
        systemIntegrator: 'Accenture',
        securityPartner: 'Crowdstrike',
        techPlatforms: 'Salesforce, Jira, Slack',
        digitalInitiatives: 'Migration of core systems to cloud-native microservices',
        existingContracts: 'Annual SaaS subscription tier 1',
        renewalDates: '2027-06-30',
        leadSource: 'Referral',
        accountSource: 'Inbound Sales',
        referralPartner: 'Channel Partner Inc.',
        accountPriority: 'High',
        accountTier: 'Tier 1 – Strategic Account',
        strategicAccount: true,
        estimatedRevenue: 15000000,
        currentSpend: 80000,
        competitorInfo: 'Using standard legacy CRM tools',
        keyChallenges: 'Siloed data and manual validation processes',
        nextAction: 'Deliver customized product walkthrough and contract proposal',
        nextFollowUpDate: '2026-07-05',
        existingCustomer: true,
        currentProducts: 'CRM Premium Suite, Analytics Hub',
        previousOrders: 'PO-2025-0912, PO-2026-0034',
        lastPurchaseDate: '2026-01-15',
        activeOpportunities: 2,
        expectedDealSize: 120000,
        expectedClosureDate: '2026-09-30',
        probabilityClosure: 85,
        description: 'Global IT consulting enterprise, expanding digital workflow capabilities.'
      },
      {
        name: 'Apex BioLabs Inc',
        ownerId: bobContact.id,
        accountType: 'Prospect',
        industry: 'Healthcare',
        status: 'active',
        category: 'Target',
        organizationProfile: 'Mid-Market',
        subIndustry: 'Clinical Research',
        website: 'https://apexbio.example.com',
        linkedinPage: 'https://linkedin.com/company/apexbio',
        yearEstablished: 2021,
        employeeSize: '51-200',
        annualRevenueRange: '$1M - $10M',
        marketSegment: 'Healthcare',
        employees: 120,
        officesCount: 1,
        globalPresence: false,
        countriesOperation: ['United States'],
        gstNumber: '',
        panNumber: '',
        cinNumber: '',
        paymentTerms: 'Net 45',
        creditLimit: 15000,
        taxExemptionStatus: true,
        billingStreet: '450 Innovation Way',
        billingStreet2: '',
        billingCity: 'Boston',
        billingState: 'Massachusetts',
        billingCountry: 'United States',
        billingZip: '02108',
        shippingLocation: 'Boston Lab',
        shippingStreet: '450 Innovation Way',
        shippingCity: 'Boston',
        shippingCountry: 'United States',
        shippingPhone: '+1 617 555 0199',
        primaryContactName: 'Dr. Sarah Connor',
        primaryContactDesignation: 'Head of Lab Operations',
        primaryContactDepartment: 'Research & Development',
        primaryContactEmail: 's.connor@apexbio.example.com',
        primaryContactMobile: '+1 617 555 0144',
        primaryContactPhone: '',
        primaryContactLinkedin: '',
        cloudProvider: 'Azure',
        dataCentreProvider: 'Azure US East',
        systemIntegrator: '',
        securityPartner: '',
        techPlatforms: 'Office 365, Teams',
        digitalInitiatives: 'Digitization of patient records and research pipelines',
        existingContracts: 'None',
        renewalDates: null,
        leadSource: 'Webinar',
        accountSource: 'Cold Outreach',
        referralPartner: '',
        accountPriority: 'Medium',
        accountTier: 'Tier 3 – Mid Market',
        strategicAccount: false,
        estimatedRevenue: 4500000,
        currentSpend: 12000,
        competitorInfo: 'Evaluating competitors and spreadsheet models',
        keyChallenges: 'Lacking centralized client relationship database',
        nextAction: 'Schedule clinical workflow demo',
        nextFollowUpDate: '2026-06-28',
        existingCustomer: false,
        currentProducts: '',
        previousOrders: '',
        lastPurchaseDate: null,
        activeOpportunities: 1,
        expectedDealSize: 45000,
        expectedClosureDate: '2026-11-15',
        probabilityClosure: 45,
        description: 'Clinical trial and bio-research firm interested in automating research tracking.'
      },
      {
        name: 'Vance Refrigeration',
        ownerId: bobContact.id,
        accountType: 'Partner',
        industry: 'Manufacturing',
        status: 'active',
        category: 'Strategic Partner',
        organizationProfile: 'SMB',
        subIndustry: 'Industrial Cooling',
        website: 'https://vancerefrigeration.example.com',
        linkedinPage: '',
        yearEstablished: 1995,
        employeeSize: '10-50',
        annualRevenueRange: '< $1M',
        marketSegment: 'Manufacturing',
        employees: 35,
        officesCount: 2,
        globalPresence: false,
        countriesOperation: ['United States'],
        gstNumber: '',
        panNumber: '',
        cinNumber: '',
        paymentTerms: 'Due on Receipt',
        creditLimit: 5000,
        taxExemptionStatus: false,
        billingStreet: '1725 Slough Avenue',
        billingStreet2: 'Suite 201',
        billingCity: 'Scranton',
        billingState: 'Pennsylvania',
        billingCountry: 'United States',
        billingZip: '18505',
        shippingLocation: 'Scranton Warehouse',
        shippingStreet: '1725 Slough Avenue',
        shippingCity: 'Scranton',
        shippingCountry: 'United States',
        shippingPhone: '+1 570 555 0120',
        primaryContactName: 'Bob Vance',
        primaryContactDesignation: 'Owner & President',
        primaryContactDepartment: 'Executive Office',
        primaryContactEmail: 'bob.vance@vancerefrigeration.example.com',
        primaryContactMobile: '+1 570 555 0122',
        primaryContactPhone: '+1 570 555 0120',
        primaryContactLinkedin: '',
        cloudProvider: '',
        dataCentreProvider: '',
        systemIntegrator: '',
        securityPartner: '',
        techPlatforms: '',
        digitalInitiatives: '',
        existingContracts: '',
        renewalDates: null,
        leadSource: 'Networking Event',
        accountSource: 'Partner Program',
        referralPartner: '',
        accountPriority: 'Low',
        accountTier: 'Tier 4 – SMB',
        strategicAccount: false,
        estimatedRevenue: 850000,
        currentSpend: 2500,
        competitorInfo: '',
        keyChallenges: '',
        nextAction: 'Check in on partnership agreement draft',
        nextFollowUpDate: '2026-07-15',
        existingCustomer: true,
        currentProducts: 'Cooling Support License',
        previousOrders: 'PO-2024-0012',
        lastPurchaseDate: '2024-08-01',
        activeOpportunities: 0,
        expectedDealSize: 0,
        expectedClosureDate: null,
        probabilityClosure: 0,
        description: 'Premier industrial refrigeration partner.'
      }
    ];

    const createdAccounts = {};
    for (const accPayload of accountsToCreate) {
      const acc = await accountsService.create(accPayload, accPayload.ownerId);
      createdAccounts[acc.name] = acc;
      console.log(`Account "${acc.name}" created with Completeness Score: ${acc.dataQualityScore}%`);
    }

    // 5. Seed KYC Records (B2B contacts)
    console.log('\n--- Seeding KYC ---');
    const kycToCreate = [
      // ── TechGlora Solutions Ltd KYC records ───────────────────────────────
      {
        alias: 'sanjay_kumar',
        accountId: createdAccounts['TechGlora Solutions Ltd'].id,
        contactType: 'Influencer',
        kycCategory: 'Individual',
        firstName: 'Sanjay',
        lastName: 'Kumar',
        email: 's.kumar@techglora.com',
        mobileNumber1: '+91 9988770001',
        jobFunction: 'Management',
        designation: 'CEO',
        department: 'Management',
        employeeLevel: 'C-Level',
        employeeId: 'TG-100',
        joiningDate: '2018-05-10',
        decisionAuthority: 'Full Authority',
        buyingRole: ['Decision Maker'],
        budgetOwnership: true,
        technicalEvaluator: false,
        preferredCommMode: ['Email'],
        preferredContactTime: 'Morning',
        timeZone: 'Asia/Kolkata',
        languagePreference: 'English',
        dob: '1975-04-12',
        linkedinProfile: 'https://linkedin.com/in/sanjaykumar-techglora',
        notes: 'TechGlora CEO and key visionary.',
        associationStatus: 'Active',
      },
      {
        alias: 'john_doe',
        accountId: createdAccounts['TechGlora Solutions Ltd'].id,
        contactType: 'Primary Contact',
        kycCategory: 'Individual',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@techglora.com',
        mobileNumber1: '+91 9988776655',
        mobileNumber2: '+91 9988776666',
        landlineNumber: '+91 80 1234 5678',
        jobFunction: 'Procurement',
        designation: 'VP of Procurement',
        department: 'Procurement',
        employeeLevel: 'VP',
        employeeId: 'TG-101',
        joiningDate: '2020-01-15',
        buyingRole: ['Decision Maker', 'Evaluator'],
        decisionAuthority: 'High',
        budgetOwnership: true,
        technicalEvaluator: false,
        influencerScore: 80,
        relationshipStrength: 90,
        preferredCommMode: ['Email', 'Mobile'],
        preferredContactTime: 'Afternoon',
        timeZone: 'Asia/Kolkata',
        languagePreference: 'English',
        marketingConsent: true,
        doNotContact: false,
        dob: '1985-05-15',
        anniversaryDate: '2012-10-20',
        linkedinProfile: 'https://linkedin.com/in/johndoe-procurement',
        assistantName: 'Sarah Jenkins',
        assistantContact: '+91 9988776600',
        personalInterests: ['Golf', 'Technology'],
        notes: 'Key contact for cloud consulting RFP.',
        reportingFunction: 'Operations',
        reportingToText: 'CEO',
        managerLocation: 'Bengaluru',
        managerFunction: 'Executive',
        managerDesignation: 'CEO',
        managerName: 'Sanjay Kumar',
        managerEmail: 's.kumar@techglora.com',
        managerMobile: '+91 9988770001',
        engagementFrequency: 'Monthly',
        lastMeetingDate: '2026-06-10',
        nextFollowUpDate: '2026-07-10',
        contactPriority: 'High',
        lastInteractionDate: '2026-06-20',
        lastInteractionNotes: 'Reviewed contract pricing draft.',
        relationshipScore: 85,
        influenceLevel: 'High',
        decisionMakingPower: 'High',
        customerSentiment: 'Positive',
        dataQualityScore: 95,
        duplicateContactCheck: false,
        associationStatus: 'Active',
      },

      // ── Apex BioLabs Inc KYC records ──────────────────────────────────────
      {
        alias: 'peter_silberman',
        accountId: createdAccounts['Apex BioLabs Inc'].id,
        contactType: 'Influencer',
        kycCategory: 'Individual',
        firstName: 'Peter',
        lastName: 'Silberman',
        email: 'p.silberman@apexbio.example.com',
        mobileNumber1: '+1 617 555 0100',
        jobFunction: 'Research & Development',
        designation: 'VP of Research',
        department: 'R&D',
        employeeLevel: 'VP',
        employeeId: 'AB-200',
        joiningDate: '2021-02-15',
        decisionAuthority: 'High',
        buyingRole: ['Evaluator'],
        budgetOwnership: false,
        technicalEvaluator: true,
        preferredCommMode: ['Email'],
        preferredContactTime: 'Afternoon',
        timeZone: 'America/New_York',
        languagePreference: 'English',
        dob: '1970-08-25',
        linkedinProfile: 'https://linkedin.com/in/petersilberman-apexbio',
        notes: 'R&D VP at Apex BioLabs.',
        associationStatus: 'Active',
      },
      {
        alias: 'sarah_connor',
        accountId: createdAccounts['Apex BioLabs Inc'].id,
        contactType: 'Decision Maker',
        kycCategory: 'Individual',
        firstName: 'Sarah',
        lastName: 'Connor',
        email: 's.connor@apexbio.example.com',
        mobileNumber1: '+1 617 555 0144',
        designation: 'Head of Lab Operations',
        department: 'IT',
        jobFunction: 'IT',
        employeeLevel: 'Director',
        employeeId: 'AB-204',
        joiningDate: '2022-04-01',
        buyingRole: ['Approver'],
        decisionAuthority: 'Full',
        budgetOwnership: true,
        technicalEvaluator: true,
        influencerScore: 90,
        relationshipStrength: 75,
        preferredCommMode: ['Email'],
        preferredContactTime: 'Morning',
        timeZone: 'America/New_York',
        languagePreference: 'English',
        marketingConsent: false,
        doNotContact: false,
        dob: '1978-11-22',
        linkedinProfile: 'https://linkedin.com/in/sarahconnor-biotech',
        notes: 'Interested in centralized trials management software.',
        reportingFunction: 'Research & Development',
        reportingToText: 'VP of Research',
        managerLocation: 'Boston',
        managerFunction: 'Executive',
        managerDesignation: 'VP of Research',
        managerName: 'Dr. Peter Silberman',
        managerEmail: 'p.silberman@apexbio.example.com',
        managerMobile: '+1 617 555 0100',
        engagementFrequency: 'Weekly',
        lastMeetingDate: '2026-06-15',
        nextFollowUpDate: '2026-06-28',
        contactPriority: 'Medium',
        lastInteractionDate: '2026-06-22',
        lastInteractionNotes: 'Sent customized presentation and platform architecture overview.',
        relationshipScore: 78,
        influenceLevel: 'High',
        decisionMakingPower: 'Full',
        customerSentiment: 'Neutral',
        dataQualityScore: 88,
        duplicateContactCheck: false,
        associationStatus: 'Active',
      },

      // ── Vance Refrigeration KYC records ───────────────────────────────────
      {
        alias: 'bob_vance_kyc',
        accountId: createdAccounts['Vance Refrigeration'].id,
        contactType: 'Decision Maker',
        kycCategory: 'Individual',
        firstName: 'Bob',
        lastName: 'Vance',
        email: 'bob.vance@vancerefrigeration.example.com',
        mobileNumber1: '+1 570 555 0120',
        jobFunction: 'Management',
        designation: 'Owner & President',
        department: 'Executive Office',
        employeeLevel: 'Owner',
        employeeId: 'VR-001',
        joiningDate: '1995-01-01',
        decisionAuthority: 'Full Authority',
        buyingRole: ['Decision Maker'],
        budgetOwnership: true,
        technicalEvaluator: false,
        preferredCommMode: ['Mobile'],
        preferredContactTime: 'Anytime',
        timeZone: 'America/New_York',
        languagePreference: 'English',
        dob: '1965-06-15',
        notes: 'Owner of Vance Refrigeration.',
        associationStatus: 'Active',
      },
      {
        alias: 'dwight_schrute',
        accountId: createdAccounts['Vance Refrigeration'].id,
        contactType: 'Influencer',
        kycCategory: 'Individual',
        firstName: 'Dwight',
        lastName: 'Schrute',
        email: 'd.schrute@vancerefrigeration.example.com',
        mobileNumber1: '+1 570 555 0122',
        designation: 'Assistant to the Regional Manager',
        department: 'Operations',
        jobFunction: 'Operations',
        employeeLevel: 'Manager',
        employeeId: 'VR-882',
        joiningDate: '2015-09-01',
        buyingRole: ['Influencer'],
        decisionAuthority: 'Medium',
        budgetOwnership: false,
        technicalEvaluator: true,
        influencerScore: 70,
        relationshipStrength: 60,
        preferredCommMode: ['Mobile'],
        preferredContactTime: 'Anytime',
        timeZone: 'America/New_York',
        languagePreference: 'English',
        marketingConsent: true,
        doNotContact: false,
        dob: '1970-01-20',
        linkedinProfile: 'https://linkedin.com/in/dwightschrute-beetfarm',
        notes: 'Highly details oriented. Values speed and reliability above all.',
        reportingFunction: 'Operations',
        reportingToText: 'Owner',
        managerLocation: 'Scranton',
        managerFunction: 'Executive',
        managerDesignation: 'Owner & President',
        managerName: 'Bob Vance',
        managerEmail: 'bob.vance@vancerefrigeration.example.com',
        managerMobile: '+1 570 555 0120',
        engagementFrequency: 'Quarterly',
        lastMeetingDate: '2026-05-20',
        nextFollowUpDate: '2026-07-15',
        contactPriority: 'Low',
        lastInteractionDate: '2026-05-20',
        lastInteractionNotes: 'Annual license check-in.',
        relationshipScore: 65,
        influenceLevel: 'Medium',
        decisionMakingPower: 'Low',
        customerSentiment: 'Positive',
        dataQualityScore: 82,
        duplicateContactCheck: false,
        associationStatus: 'Active',
      }
    ];

    // Create KYC records without self-references first to avoid FK constraint issues
    const createdKycs = {};
    for (const kPayload of kycToCreate) {
      const { alias, ...payload } = kPayload;
      const kyc = await kycService.create(payload, adminId);
      createdKycs[alias] = kyc;
      console.log(`KYC record created: ${kyc.firstName} ${kyc.lastName || ''} (${kyc.email})`);
    }

    // 6. Update self-references on KYC records
    console.log('\n--- Linking KYC Hierarchies and Owners ---');
    
    // John Doe updates
    const johnDoe = createdKycs['john_doe'];
    const sanjayKumar = createdKycs['sanjay_kumar'];
    if (johnDoe && sanjayKumar) {
      await johnDoe.update({
        reportingTo: sanjayKumar.id,
        accountManager: sanjayKumar.id,
        customerSuccessManager: johnDoe.id,
        preSalesOwner: sanjayKumar.id,
        relationshipOwner: sanjayKumar.id,
        accountTeam: [sanjayKumar.id, johnDoe.id],
      });
      console.log(`John Doe linked to Sanjay Kumar as manager and account team.`);
    }

    // Sarah Connor updates
    const sarahConnor = createdKycs['sarah_connor'];
    const peterSilberman = createdKycs['peter_silberman'];
    if (sarahConnor && peterSilberman) {
      await sarahConnor.update({
        reportingTo: peterSilberman.id,
        accountManager: peterSilberman.id,
        customerSuccessManager: sarahConnor.id,
        preSalesOwner: peterSilberman.id,
        relationshipOwner: peterSilberman.id,
        accountTeam: [peterSilberman.id],
      });
      console.log(`Sarah Connor linked to Peter Silberman as manager.`);
    }

    // Dwight Schrute updates
    const dwightSchrute = createdKycs['dwight_schrute'];
    const bobVanceKyc = createdKycs['bob_vance_kyc'];
    if (dwightSchrute && bobVanceKyc) {
      await dwightSchrute.update({
        reportingTo: bobVanceKyc.id,
        accountManager: bobVanceKyc.id,
        customerSuccessManager: dwightSchrute.id,
        preSalesOwner: bobVanceKyc.id,
        relationshipOwner: bobVanceKyc.id,
        accountTeam: [bobVanceKyc.id, dwightSchrute.id],
      });
      console.log(`Dwight Schrute linked to Bob Vance as manager.`);
    }

    console.log('\nSync seeding completed successfully!');
    if (require.main === module) {
      process.exit(0);
    }
  } catch (err) {
    console.error('Error seeding dummy data:', err);
    if (require.main === module) {
      process.exit(1);
    } else {
      throw err;
    }
  }
}

if (require.main === module) {
  seedDummyData();
} else {
  module.exports = seedDummyData;
}
