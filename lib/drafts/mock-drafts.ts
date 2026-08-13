export type DraftFile = {
  type: "file";
  id: string;
  name: string;
  extension: "DOCX";
};

export type DraftFolder = {
  type: "folder";
  id: string;
  name: string;
  children: DraftNode[];
};

export type DraftNode = DraftFolder | DraftFile;

export const draftLibrary: DraftFolder = {
  type: "folder",
  id: "root",
  name: "English Legal Draft",
  children: [
    {
      type: "folder",
      id: "acknowledgement",
      name: "Acknowledgement",
      children: [
        {
          type: "folder",
          id: "acknowledgements",
          name: "ACKNOWLEDGEMENTS",
          children: [
            {
              type: "file",
              id: "ack-debt",
              name: "Acknowledgement of Debt",
              extension: "DOCX",
            },
            {
              type: "file",
              id: "ack-limitation",
              name: "Acknowledgement to Extend Limitation",
              extension: "DOCX",
            },
            {
              type: "file",
              id: "ack-part-payment",
              name: "Acknowledgement of Part Payment of a Debt",
              extension: "DOCX",
            },
            {
              type: "file",
              id: "ack-endorsement-promissory-note",
              name: "Acknowledgement by Endorsement on the Promissory Note",
              extension: "DOCX",
            },
          ],
        },
        {
          type: "folder",
          id: "ack-debt-category",
          name: "debt",
          children: [
            {
              type: "file",
              id: "acknowledgement-of-debt",
              name: "Acknowledgement of Debt",
              extension: "DOCX",
            },
            {
              type: "file",
              id: "acknowledgement-of-failure-payment",
              name: "Acknowledgement of Part Payment of a Debt",
              extension: "DOCX",
            },
          ],
        },
        {
          type: "folder",
          id: "ack-limitation-category",
          name: "Limitation",
          children: [],
        },
        {
          type: "folder",
          id: "ack-loan",
          name: "loan",
          children: [],
        },
        {
          type: "folder",
          id: "ack-mortgage",
          name: "MORTGAGE",
          children: [],
        },
        {
          type: "folder",
          id: "ack-receipts",
          name: "RECEIPTS",
          children: [],
        },
      ],
    },

    {
      type: "folder",
      id: "adoption",
      name: "Adoption",
      children: [
        {
          type: "file",
          id: "adoption-hindu-widow",
          name: "Adoption by a Hindu Widow",
          extension: "DOCX",
        },
        {
          type: "file",
          id: "adoption-adoptive-father",
          name: "Adoption by an Adoptive Father",
          extension: "DOCX",
        },
        {
          type: "file",
          id: "adoption-guardian",
          name: "Adoption Deed by Guardian",
          extension: "DOCX",
        },
        {
          type: "file",
          id: "adoption-natural-mother",
          name: "Adoption Deed by Widower Natural Mother",
          extension: "DOCX",
        },
      ],
    },

    {
      type: "folder",
      id: "affidavit",
      name: "Affidavit",
      children: [],
    },

    {
      type: "folder",
      id: "agreement",
      name: "Agreement",
      children: [],
    },

    {
      type: "folder",
      id: "application",
      name: "Application",
      children: [],
    },

    {
      type: "folder",
      id: "appointment",
      name: "Appointment",
      children: [],
    },

    {
      type: "folder",
      id: "arbitration",
      name: "Arbitration",
      children: [],
    },

    {
      type: "folder",
      id: "arbitration-conciliation",
      name: "Arbitration and Conciliation",
      children: [],
    },

    {
      type: "folder",
      id: "assignment",
      name: "Assignment",
      children: [],
    },

    {
      type: "folder",
      id: "bail",
      name: "BAIL",
      children: [],
    },

    {
      type: "folder",
      id: "banking",
      name: "Banking",
      children: [],
    },

    {
      type: "folder",
      id: "bond",
      name: "Bond",
      children: [],
    },

    {
      type: "folder",
      id: "business",
      name: "Business",
      children: [],
    },

    {
      type: "folder",
      id: "child-custody",
      name: "Child Custody",
      children: [],
    },

    {
      type: "folder",
      id: "civil-pleadings",
      name: "Civil Pleadings",
      children: [],
    },

    {
      type: "folder",
      id: "civil-procedure-code",
      name: "Civil Procedure Code",
      children: [],
    },

    {
      type: "folder",
      id: "classification-offences",
      name: "Classification Of Offences",
      children: [],
    },

    {
      type: "folder",
      id: "company",
      name: "Company",
      children: [],
    },

    {
      type: "folder",
      id: "company-law",
      name: "Company Law",
      children: [],
    },

    {
      type: "folder",
      id: "compromise",
      name: "COMPROMISE",
      children: [],
    },

    {
      type: "folder",
      id: "consumer",
      name: "CONSUMER",
      children: [],
    },

    {
      type: "folder",
      id: "consumer-law",
      name: "Consumer Law",
      children: [],
    },

    {
      type: "folder",
      id: "consumer-protection",
      name: "Consumer protection act",
      children: [],
    },

    {
      type: "folder",
      id: "contract-law",
      name: "Contract Law",
      children: [],
    },

    {
      type: "folder",
      id: "conveyancing",
      name: "Conveyancing",
      children: [],
    },

    {
      type: "folder",
      id: "copyright",
      name: "Copyright",
      children: [],
    },

    {
      type: "folder",
      id: "criminal-law",
      name: "Criminal Law",
      children: [],
    },

    {
      type: "folder",
      id: "criminal-pleading",
      name: "Criminal Pleading",
      children: [],
    },

    {
      type: "folder",
      id: "criminal-revision",
      name: "Criminal Revision",
      children: [],
    },

    {
      type: "folder",
      id: "dishonour-cheque",
      name: "DISHONOUR OF CHEQUE",
      children: [],
    },
  ],
};