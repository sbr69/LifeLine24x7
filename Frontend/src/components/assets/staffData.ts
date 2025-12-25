export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  schedule: string;
  status: 'On Duty' | 'Off Duty' | 'On Leave';
  image?: string;
  initials?: string;
  initialsColor?: string;
}

export const staffMembers: StaffMember[] = [
  {
    id: 'S-1104',
    name: 'Dr. James Wilson',
    role: 'Senior Cardiologist',
    department: 'Cardiology Dept.',
    email: 'wilson.j@lifeline.com',
    phone: '+1 (555) 123-4567',
    schedule: '08:00 AM - 04:00 PM',
    status: 'On Duty',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFTE7ylEP841ikFrR4-zg5p6B3v2jkdj-HvrAMAnE0i1PctiEgR4fgUqafnPCnQ8Owg4MVF3M4hIPsLJ0m3jKTmiw_GbAlaiZsONO0Gv-sakVlr9eFnce98v9K-B6Hjs2LkvNCmgdzCSFeHIxhLUb0J172bFzlm1oAzRFk9pGahekUiGsK8lgpvIwboBC4F-C_qr7R-5tI1iDu2PBDDtejCoJ8tRJ4WLCvyzcz0HMAIG5WwTi16SROWILqTQXJptGH9v-Clh-iOKvl'
  },
  {
    id: 'S-2201',
    name: 'Emma Larson',
    role: 'Head Nurse',
    department: 'ICU Ward',
    email: 'emma.l@lifeline.com',
    schedule: '04:00 PM - 12:00 AM',
    status: 'Off Duty',
    initials: 'EL',
    initialsColor: 'bg-purple-900/40 text-purple-200'
  },
  {
    id: 'S-1156',
    name: 'Dr. Alan Grant',
    role: 'Surgeon',
    department: 'General Surgery',
    email: 'alan.g@lifeline.com',
    phone: '+1 (555) 987-6543',
    schedule: 'On Leave',
    status: 'On Leave',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOMJ3hNBO1aAjcgw6M3JguFz0lNkijl_C912--pNmme255DR11n4tc1ltDeT0DcIPwmn85hKGPcS692wuY4Fnu_5jsygA7etgBF5cs-DZxR55PZv35y3TLrsSNhX8VcJ_syMSgKFMHb2Fhbfi4tcR9nwebYaceP6JXDLk2tk25oP1_u-UCYsHrwPc-fL-8bruKZmnUg9JChCKb90Y4ePfF-5qC7HD1FmHTZ-ARE4QXgG4FJS8CVXRkRW5fXx0rD4onlHkMyhXUFoIX'
  },
  {
    id: 'S-3304',
    name: 'Robert Jones',
    role: 'Lab Technician',
    department: 'Pathology',
    email: 'robert.j@lifeline.com',
    schedule: '08:00 AM - 04:00 PM',
    status: 'On Duty',
    initials: 'RJ',
    initialsColor: 'bg-orange-900/40 text-orange-200'
  },
  {
    id: 'S-1188',
    name: 'Dr. Lisa Ray',
    role: 'Pediatrician',
    department: 'Pediatrics',
    email: 'lisa.ray@lifeline.com',
    phone: '+1 (555) 321-9876',
    schedule: '10:00 AM - 06:00 PM',
    status: 'On Duty',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAebDWDDkaLIS_2tfb6RDv3ez1mJrGb578ZvWxTwmZpJgu0-51LUrQBMPIhovigcfM4N67ZlCCAp8Qele68FPCu8lByQ0Iq19gtVs2ESV3l8pYmTS8yzEgp9QV_cpHKSCvCGOgUyAs4pIfoX3Src127QsuluqmIPiPWvRbu39fQ5vUizEsBnS8lOLcu_gDOpUsAmAQSvxjL1VSo-_gElDi8fDf5yHK2YdCOF2Sed_oQycpCRGI-T8oRx9m9V-q38x7I-Qorr6La98eX'
  }
];

export const staffStats = {
  totalStaff: 156,
  onDuty: 64,
  doctors: {
    count: 45,
    percentage: 45
  },
  nurses: {
    count: 82,
    percentage: 70
  }
};
