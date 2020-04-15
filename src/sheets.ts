import "core-js/stable";
import "regenerator-runtime/runtime";

// @ts-ignore
import { GoogleSpreadsheet } from 'google-spreadsheet';

import { getCommuteInfo }  from "./get_commute_info";

import * as creds from '../client_secret.json';

const getAddress = (row: any) => {
  return row.Address;
}

const addCommuteInfoToSpreadsheet = async() => {
  // REAL DOC = 11BJGi9N09pEQ101_ZU-tnUWHLWn4OfEq8F1tUx1tczQ
  // TEST (COPY) DOC = 18H6MRPfi3DydU-A1x-axkvRkCYnbqhstFnEc8OClHyk
  const doc = new GoogleSpreadsheet('11BJGi9N09pEQ101_ZU-tnUWHLWn4OfEq8F1tUx1tczQ');
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id]

  const rows = await sheet.getRows();
  rows.forEach((row: any) => {
    const address = getAddress(row);
    getCommuteInfo(address).then( (info: any) => {
      row["Travel to Expedia"] = info;
      console.log(`Modified cell with ${info}.`);
      return row;
    }).then( (r: any) => {
      r.save();
    }).catch((err: any) => console.log(err));
  });
}

addCommuteInfoToSpreadsheet();