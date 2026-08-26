import { generatePDF } from 'react-native-html-to-pdf';
import { Platform, Alert } from 'react-native';
import RNFetchBlob, { MediaCollection } from 'react-native-blob-util';

type TransactionEntry = {
  date: string;
  particulars: string;
  type: 'debit' | 'credit';
  amount: number;
  balance: number;
};

type SoaPdfData = {
  loanType: string;
  loanId: string;
  period: string;
  entries: TransactionEntry[];
  summary: {
    opening: number;
    totalDebit: number;
    totalCredit: number;
    closing: number;
  };
};

type CloserPdfData = {
  loanType: string;
  loanId: string;
  outstanding: number;
  interestRate: number;
  accruedInterest: number;
  foreclosureRate: number;
  foreclosureFee: number;
  totalClosure: number;
  validTill: string;
  asOfDate: string;
};

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const generateSoaHtml = (data: SoaPdfData): string => {
  const rows = data.entries
    .map(
      entry => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 12px; color: #374151;">${
          entry.date
        }</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 12px; color: #374151;">${
          entry.particulars
        }</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 12px; text-align: right; color: ${
          entry.type === 'credit' ? '#16a34a' : '#dc2626'
        };">${formatINR(entry.amount)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 12px; text-align: right; font-weight: 600; color: #111827;">${formatINR(
          entry.balance,
        )}</td>
      </tr>`,
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; color: #111827; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; }
        .header h1 { margin: 0 0 8px 0; font-size: 22px; font-weight: 700; }
        .header p { margin: 0; font-size: 12px; opacity: 0.85; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 24px; }
        .info-box { flex: 1; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-right: 8px; }
        .info-box:last-child { margin-right: 0; }
        .info-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; font-weight: 600; }
        .info-value { font-size: 14px; font-weight: 700; margin-top: 4px; color: #111827; }
        .info-value.highlight { color: #1e40af; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th { background: #f3f4f6; padding: 10px 8px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; border-bottom: 2px solid #e5e7eb; }
        th:last-child, td:last-child { text-align: right; }
        th:nth-child(3), td:nth-child(3) { text-align: right; }
        .footer { margin-top: 24px; padding-top: 16px; border-top: 2px solid #e5e7eb; text-align: center; font-size: 10px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Statement of Account</h1>
        <p>${data.loanType} &bull; ${data.loanId} &bull; ${data.period}</p>
      </div>

      <div class="info-row">
        <div class="info-box">
          <div class="info-label">Opening Balance</div>
          <div class="info-value">${formatINR(data.summary.opening)}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Total Debits</div>
          <div class="info-value">${formatINR(data.summary.totalDebit)}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Total Credits</div>
          <div class="info-value">${formatINR(data.summary.totalCredit)}</div>
        </div>
        <div class="info-box">
          <div class="info-label">Closing Balance</div>
          <div class="info-value highlight">${formatINR(
            data.summary.closing,
          )}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Particulars</th>
            <th>Amount</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <div class="footer">
        Generated on ${new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })} &bull; HMT Customer App
      </div>
    </body>
    </html>
  `;
};

export async function generateSoaPdf(data: SoaPdfData): Promise<void> {
  try {
    const html = generateSoaHtml(data);
    const fileName = `SOA_${data.loanId}_${Date.now()}`;

    const options = {
      html,
      fileName,
      base64: false,
    };

    const file = await generatePDF(options);

    if (file.filePath) {
      if (Platform.OS === 'android') {
        const destPath = `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}.pdf`;
        await RNFetchBlob.fs.cp(file.filePath, destPath);

        const mediaUri = await RNFetchBlob.MediaCollection.copyToMediaStore(
          {
            name: `${fileName}.pdf`,
            parentFolder: '',
            mimeType: 'application/pdf',
          },
          'Download',
          destPath,
        );

        Alert.alert(
          'Download Complete',
          `Statement saved to Downloads.\n${mediaUri}`,
          [{ text: 'OK' }],
        );
      } else {
        Alert.alert(
          'Download Complete',
          `Statement saved to:\n${file.filePath}`,
          [{ text: 'OK' }],
        );
      }
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    Alert.alert(
      'Download Failed',
      'Unable to generate PDF. Please try again.',
      [{ text: 'OK' }],
    );
  }
}

const generateCloserHtml = (data: CloserPdfData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; color: #111827; }
        .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 24px; border-radius: 12px; margin-bottom: 24px; }
        .header h1 { margin: 0 0 8px 0; font-size: 22px; font-weight: 700; }
        .header p { margin: 0; font-size: 12px; opacity: 0.85; }
        .total-box { background: #eff6ff; border: 2px solid #3b82f6; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px; }
        .total-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: 600; }
        .total-value { font-size: 28px; font-weight: 800; color: #1e40af; margin-top: 8px; }
        .validity { font-size: 11px; color: #6b7280; margin-top: 8px; }
        .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; margin-bottom: 12px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        tr { border-bottom: 1px solid #e5e7eb; }
        td { padding: 12px 8px; font-size: 13px; }
        td:first-child { color: #374151; font-weight: 500; }
        td:last-child { text-align: right; font-weight: 700; color: #111827; }
        tr.total-row td { border-top: 2px solid #1e40af; border-bottom: none; font-size: 15px; font-weight: 800; color: #1e40af; padding-top: 16px; }
        .chip { display: inline-block; background: #f3f4f6; border-radius: 4px; padding: 2px 8px; font-size: 11px; font-weight: 600; color: #6b7280; margin-left: 8px; }
        .steps { margin-top: 24px; }
        .step { display: flex; align-items: flex-start; margin-bottom: 16px; }
        .step-num { width: 24px; height: 24px; border-radius: 12px; background: #1e40af; color: white; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-right: 12px; flex-shrink: 0; }
        .step-title { font-size: 13px; font-weight: 700; color: #111827; }
        .step-desc { font-size: 11px; color: #6b7280; margin-top: 2px; }
        .footer { margin-top: 24px; padding-top: 16px; border-top: 2px solid #e5e7eb; text-align: center; font-size: 10px; color: #9ca3af; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Loan Closure Statement</h1>
        <p>${data.loanType} &bull; ${data.loanId}</p>
      </div>

      <div class="total-box">
        <div class="total-label">Total Closure Amount</div>
        <div class="total-value">${formatINR(data.totalClosure)}</div>
        <div class="validity">Quote as of ${data.asOfDate} &bull; Valid till ${data.validTill}</div>
      </div>

      <div class="section-title">Closure Breakup</div>
      <table>
        <tr>
          <td>Principal Outstanding</td>
          <td>${formatINR(data.outstanding)}</td>
        </tr>
        <tr>
          <td>Interest Accrued <span class="chip">${data.interestRate}% p.a.</span></td>
          <td>${formatINR(data.accruedInterest)}</td>
        </tr>
        <tr>
          <td>Foreclosure Charges <span class="chip">${data.foreclosureRate}%</span></td>
          <td>${formatINR(data.foreclosureFee)}</td>
        </tr>
        <tr class="total-row">
          <td>Total Closure Amount</td>
          <td>${formatINR(data.totalClosure)}</td>
        </tr>
      </table>

      <div class="section-title">After Full Payment</div>
      <div class="steps">
        <div class="step">
          <div class="step-num">1</div>
          <div>
            <div class="step-title">Pay Closure Amount</div>
            <div class="step-desc">Complete the full payment before the quote validity ends.</div>
          </div>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <div>
            <div class="step-title">NOC & Documents</div>
            <div class="step-desc">NOC and original documents are dispatched within 15 working days.</div>
          </div>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <div>
            <div class="step-title">Loan Closed</div>
            <div class="step-desc">No further interest or charges apply after full payment.</div>
          </div>
        </div>
      </div>

      <div class="footer">
        Generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })} &bull; HMT Customer App
      </div>
    </body>
    </html>
  `;
};

export async function generateCloserPdf(data: CloserPdfData): Promise<void> {
  try {
    const html = generateCloserHtml(data);
    const fileName = `Closure_${data.loanId}_${Date.now()}`;

    const options = {
      html,
      fileName,
      base64: false,
    };

    const file = await generatePDF(options);

    if (file.filePath) {
      if (Platform.OS === 'android') {
        const destPath = `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}.pdf`;
        await RNFetchBlob.fs.cp(file.filePath, destPath);

        const mediaUri = await RNFetchBlob.MediaCollection.copyToMediaStore(
          {
            name: `${fileName}.pdf`,
            parentFolder: '',
            mimeType: 'application/pdf',
          },
          'Download',
          destPath,
        );

        Alert.alert(
          'Download Complete',
          `Closure statement saved to Downloads.\n${mediaUri}`,
          [{ text: 'OK' }],
        );
      } else {
        Alert.alert(
          'Download Complete',
          `Statement saved to:\n${file.filePath}`,
          [{ text: 'OK' }],
        );
      }
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    Alert.alert(
      'Download Failed',
      'Unable to generate PDF. Please try again.',
      [{ text: 'OK' }],
    );
  }
}
