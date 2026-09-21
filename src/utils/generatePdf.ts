import { generatePDF } from 'react-native-html-to-pdf';
import { Platform } from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import { toast } from '../components/toast/ToastProvider';

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

        await RNFetchBlob.MediaCollection.copyToMediaStore(
          {
            name: `${fileName}.pdf`,
            parentFolder: '',
            mimeType: 'application/pdf',
          },
          'Download',
          destPath,
        );

        toast.show('Statement saved to Downloads.', 'success');
      } else {
        toast.show(
          `Statement saved to:\n${file.filePath}`,
          'success',
        );
      }
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    toast.show('Unable to generate PDF. Please try again.', 'error');
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

        await RNFetchBlob.MediaCollection.copyToMediaStore(
          {
            name: `${fileName}.pdf`,
            parentFolder: '',
            mimeType: 'application/pdf',
          },
          'Download',
          destPath,
        );

        toast.show('Closure statement saved to Downloads.', 'success');
      } else {
        toast.show(
          `Statement saved to:\n${file.filePath}`,
          'success',
        );
      }
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    toast.show('Unable to generate PDF. Please try again.', 'error');
  }
}

type AmortizationInstallment = {
  no: number;
  date: string;
  principal: number;
  interest: number;
  emi: number;
  balance: number;
  status: 'Paid' | 'Upcoming';
};

type AmortizationPdfData = {
  loan: {
    accountNo: string;
    type: string;
    principal: number;
    interestRate: number;
    tenureMonths: number;
    startDate: string;
    frequency: string;
    disbursementDate: string;
  };
  emi: number;
  totalInterest: number;
  totalPayable: number;
  paidCount: number;
  schedule: AmortizationInstallment[];
};

const formatAmount = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const generateAmortizationHtml = (data: AmortizationPdfData): string => {
  const headerRows = [
    { label: 'Loan Account No', value: data.loan.accountNo },
    { label: 'Loan Type', value: data.loan.type },
    { label: 'Loan Amount', value: formatAmount(data.loan.principal) },
    { label: 'Interest Rate', value: `${data.loan.interestRate}% p.a.` },
    { label: 'Tenure', value: `${data.loan.tenureMonths} months` },
    { label: 'Monthly EMI', value: formatAmount(data.emi) },
    { label: 'Disbursement', value: data.loan.disbursementDate },
    { label: 'Total Interest', value: formatAmount(data.totalInterest) },
    { label: 'Total Payable', value: formatAmount(data.totalPayable) },
  ];

  const headerCells = headerRows
    .map(
      (row) => `
      <div class="cell">
        <span class="label">${row.label}</span>
        <span class="value">${row.value}</span>
      </div>`,
    )
    .join('');

  const scheduleRows = data.schedule
    .map(
      (row) => `
      <tr>
        <td>${row.no}</td>
        <td>${row.date}</td>
        <td>${formatAmount(row.principal)}</td>
        <td>${formatAmount(row.interest)}</td>
        <td>${formatAmount(row.emi)}</td>
        <td>${formatAmount(row.balance)}</td>
        <td>${row.status}</td>
      </tr>`,
    )
    .join('');

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          @page { margin: 20px; }
          body { font-family: Arial, Helvetica, sans-serif; color: #1E293B; margin: 0; padding: 20px; }
          .header { border-bottom: 3px solid #2563EB; padding-bottom: 16px; margin-bottom: 20px; }
          .brand { font-size: 24px; font-weight: bold; color: #2563EB; }
          .heading { font-size: 18px; font-weight: bold; text-align: right; margin-top: 8px; }
          .subheading { font-size: 11px; color: #64748B; text-align: right; }
          .meta-grid { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 20px; }
          .cell { flex: 1 1 30%; min-width: 140px; background: #F1F5F9; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px 12px; box-sizing: border-box; }
          .label { display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748B; margin-bottom: 4px; }
          .value { font-size: 14px; font-weight: bold; }
          table { width: 100%; border-collapse: collapse; font-size: 10px; }
          th { background: #2563EB; color: #fff; padding: 8px 6px; text-align: left; }
          td { padding: 6px; border-bottom: 1px solid #E2E8F0; }
          tr:nth-child(even) td { background: #F8FAFC; }
          .footer { margin-top: 24px; text-align: center; font-size: 10px; color: #94A3B8; border-top: 1px solid #E2E8F0; padding-top: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div class="brand">Finaux</div>
            <div>
              <div class="heading">Loan Amortization Schedule</div>
              <div class="subheading">Generated on ${data.loan.startDate}</div>
            </div>
          </div>
        </div>

        <div class="meta-grid">${headerCells}</div>

        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Principal</th>
              <th>Interest</th>
              <th>EMI</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${scheduleRows}</tbody>
        </table>

        <div class="footer">Finaux Customer App - Confidential</div>
      </body>
    </html>
  `;
};

export async function generateAmortizationPdf(
  data: AmortizationPdfData,
): Promise<string | void> {
  try {
    const html = generateAmortizationHtml(data);
    const fileName = `Amortization_${data.loan.accountNo.replace(
      /[^a-zA-Z0-9]/g,
      '_',
    )}`;

    const destPath: string | undefined =
      Platform.OS === 'android'
        ? `${RNFetchBlob.fs.dirs.DownloadDir}/${fileName}.pdf`
        : undefined;

    const file = await generatePDF({ html, fileName, directory: 'Downloads' });

    if (Platform.OS === 'android' && destPath) {
      RNFetchBlob.fs
        .mv(file.filePath, destPath)
        .then(() => {
          RNFetchBlob.android.actionViewIntent(destPath, 'application/pdf');
        })
        .catch(() => {
          toast.show('Unable to generate PDF. Please try again.', 'error');
        });
    }
    return file.filePath;
  } catch (error) {
    console.error('PDF generation error:', error);
    toast.show('Unable to generate PDF. Please try again.', 'error');
  }
}
