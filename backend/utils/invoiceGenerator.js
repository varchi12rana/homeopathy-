const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const generateInvoice = async (order, userDetails) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 40px; }
            .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #eee; box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); font-size: 16px; line-height: 24px; color: #555; }
            .invoice-box table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
            .invoice-box table td { padding: 5px; vertical-align: top; }
            .invoice-box table tr.top table td { padding-bottom: 20px; }
            .invoice-box table tr.top table td.title { font-size: 45px; line-height: 45px; color: #333; }
            .invoice-box table tr.information table td { padding-bottom: 40px; }
            .invoice-box table tr.heading td { background: #eee; border-bottom: 1px solid #ddd; font-weight: bold; }
            .invoice-box table tr.details td { padding-bottom: 20px; }
            .invoice-box table tr.item td { border-bottom: 1px solid #eee; }
            .invoice-box table tr.item.last td { border-bottom: none; }
            .invoice-box table tr.total td:nth-child(2) { border-top: 2px solid #eee; font-weight: bold; }
            .logo-text { font-size: 28px; font-weight: bold; color: #047857; }
        </style>
    </head>
    <body>
        <div class="invoice-box">
            <table cellpadding="0" cellspacing="0">
                <tr class="top">
                    <td colspan="2">
                        <table>
                            <tr>
                                <td class="title">
                                    <div class="logo-text">HOMEOVIA</div>
                                </td>
                                <td style="text-align: right;">
                                    Invoice #: ${order.invoiceNumber || order._id}<br>
                                    Order #: ${order._id}<br>
                                    Created: ${new Date(order.createdAt).toLocaleDateString()}<br>
                                    Payment Status: ${order.paymentStatus}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr class="information">
                    <td colspan="2">
                        <table>
                            <tr>
                                <td>
                                    <strong>Homeovia</strong><br>
                                    102, Sahyog Shopping Centre,<br>
                                    Udhna Main Road, Surat, Gujarat-394210<br>
                                    homeovia.care@gmail.com
                                </td>
                                <td style="text-align: right;">
                                    <strong>Billed To:</strong><br>
                                    ${userDetails.name}<br>
                                    ${userDetails.email}<br>
                                    ${order.shippingAddress.address}, ${order.shippingAddress.city}<br>
                                    ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}<br>
                                    Ph: ${order.shippingAddress.phoneNumber}
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table cellpadding="0" cellspacing="0" style="margin-top: 20px;">
                <tr class="heading">
                    <td>Item</td>
                    <td style="text-align: right;">Price</td>
                </tr>
                
                ${order.products.map(item => `
                <tr class="item">
                    <td>${item.name} (x${item.qty})</td>
                    <td style="text-align: right;">₹${(item.price * item.qty).toFixed(2)}</td>
                </tr>
                `).join('')}

                <tr class="total">
                    <td></td>
                    <td style="text-align: right;">Total: ₹${order.totalPrice.toFixed(2)}</td>
                </tr>
            </table>
            
            <div style="margin-top: 40px; text-align: center; font-size: 14px; color: #888;">
                Thank you for your purchase!<br>
                For any queries, contact homeovia.care@gmail.com
            </div>
        </div>
    </body>
    </html>
  `;

  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  
  return pdfBuffer;
};

module.exports = { generateInvoice };
