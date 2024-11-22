import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { USER_FIELDS } from '../types/UserField';
import { UserRow } from '../types/UserRow';

export default class Sheet {
  private readonly document: GoogleSpreadsheet;
  private sheet?: GoogleSpreadsheetWorksheet;

  constructor() {
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      key: process.env.GOOGLE_PRIVATE_KEY!,
      scopes: process.env.GOOGLE_SCOPES!.split(' '),
    });
    this.document = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);
  }

  async init() {
    await this.document.loadInfo();
    this.sheet = this.document.sheetsById[0];
    await this.sheet.clear();
    await this.sheet.setHeaderRow(USER_FIELDS);
  }

  async fillSheet(clients: UserRow[]) {
    if (!this.sheet) {
      return;
    }

    await this.sheet.addRows(clients, { insert: true });
  }
}