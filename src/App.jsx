import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  CreditCard,
  Wallet,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  Info,
  ShieldCheck,
  Settings,
  ShoppingBag,
  Code,
  Copy,
  ExternalLink,
  Check
} from 'lucide-react';

const UPI_METHODS = [
  { id: 'gpay', name: 'Google Pay', icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'upi', name: 'UPI ID', icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'card', name: 'Card', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'wallet', name: 'Wallet', icon: Wallet, color: 'text-orange-600', bg: 'bg-orange-50' },
];

function App() {
  const [view, setView] = useState('customer'); // customer, merchant
  const [amount, setAmount] = useState('100.00');
  const [method, setMethod] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [status, setStatus] = useState('idle'); // idle, processing, success, failure
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  // Merchant Settings
  const [merchantConfig, setMerchantConfig] = useState({
    pa: 'demo@upi',
    pn: 'UPI Demo Business',
    mc: '1234',
    tr: 'ORD12345ABC',
    tn: 'Payment for Demo Order',
  });

  const handlePayment = () => {
    setStatus('processing');

    // Simulate network delay
    setTimeout(() => {
      if (method === 'upi' || method === 'gpay') {
        if (upiId === 'demo@upi' || method === 'gpay') {
          setStatus('success');
        } else {
          setStatus('failure');
          setErrorMsg('Invalid UPI ID. Try demo@upi');
        }
      } else if (method === 'card') {
        if (cardDetails.number.replace(/\s/g, '') === '4111111111111111') {
          setStatus('success');
        } else {
          setStatus('failure');
          setErrorMsg('Invalid Card Number. Try 4111 1111 1111 1111');
        }
      } else {
        setStatus('success'); // Wallet always succeeds in demo
      }
    }, 2000);
  };

  const reset = () => {
    setStatus('idle');
    setMethod(null);
    setUpiId('');
    setCardDetails({ number: '', expiry: '', cvv: '' });
    setErrorMsg('');
  };

  const codeSnippet = `const supportedInstruments = [
  {
    supportedMethods: ['https://tez.google.com/pay'],
    data: {
      pa: '${merchantConfig.pa}',
      pn: '${merchantConfig.pn}',
      tr: '${merchantConfig.tr}',
      url: window.location.href,
      mc: '${merchantConfig.mc}',
      tn: '${merchantConfig.tn}',
    },
  }
];

const details = {
  total: {
    label: 'Total',
    amount: { currency: 'INR', value: '${amount}' },
  },
};

const request = new PaymentRequest(supportedInstruments, details);
request.show().then(response => {
  // Handle response
});`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderStatus = () => {
    if (status === 'processing') {
      return (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-8 text-center"
        >
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">Processing Payment</h2>
          <p className="text-gray-500 mt-2">Connecting to Google Pay...</p>
        </motion.div>
      );
    }

    if (status === 'success') {
      return (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center p-8 text-center"
        >
          <CheckCircle2 className="w-20 h-20 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
          <p className="text-gray-600 mt-2">Received by: {merchantConfig.pn}</p>
          <p className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1">
            <ShieldCheck size={14} /> Ref: {merchantConfig.tr}
          </p>
          <button
            onClick={reset}
            className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            Return to Store
          </button>
        </motion.div>
      );
    }

    if (status === 'failure') {
      return (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center justify-center p-8 text-center"
        >
          <XCircle className="w-20 h-20 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">Payment Failed</h2>
          <p className="text-red-600 mt-2">{errorMsg}</p>
          <button
            onClick={() => setStatus('idle')}
            className="mt-8 bg-gray-800 text-white px-6 py-2 rounded-full font-medium hover:bg-gray-900 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-4 font-sans">
      {/* Navigation Toggle */}
      <div className="w-full max-w-md bg-white rounded-full p-1 shadow-sm mb-6 flex border border-gray-200">
        <button
          onClick={() => setView('customer')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-bold transition-all ${view === 'customer' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <ShoppingBag size={18} /> Customer View
        </button>
        <button
          onClick={() => setView('merchant')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-bold transition-all ${view === 'merchant' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <Settings size={18} /> Merchant Config
        </button>
      </div>

      <div className="w-full max-w-md bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg mb-6 flex items-start gap-3 shadow-sm">
        <Info className="shrink-0 mt-0.5" size={18} />
        <p className="text-xs font-medium">
          <strong>Demo Mode:</strong> No real transactions are processed. This tool demonstrates the Google Pay India API integration for merchants.
        </p>
      </div>

      {view === 'customer' ? (
        <motion.div
          layout
          className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
        >
          <AnimatePresence mode="wait">
            {status === 'idle' ? (
              <motion.div
                key="payment-form"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-6"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
                    <p className="text-sm text-gray-500">Merchant: {merchantConfig.pn}</p>
                  </div>
                  <div className="text-right min-w-[130px]">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Total Amount</p>
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-2xl font-black text-blue-600">₹</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-2xl font-black text-blue-600 w-28 text-right focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                </div>

                {!method ? (
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-gray-700">Select Payment Method</p>
                    <div className="grid grid-cols-1 gap-3">
                      {UPI_METHODS.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setMethod(m.id)}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${m.bg} ${m.color}`}>
                              <m.icon size={24} />
                            </div>
                            <span className="font-medium text-gray-700">{m.name}</span>
                          </div>
                          <div className="w-6 h-6 rounded-full border-2 border-gray-200 group-hover:border-blue-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <button
                      onClick={() => setMethod(null)}
                      className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline"
                    >
                      <ArrowLeft size={16} /> Change Method
                    </button>

                    {method === 'gpay' && (
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3 text-left">
                          <Smartphone className="text-blue-600" />
                          <div>
                            <p className="font-semibold text-blue-900 text-sm">Pay with Google Pay</p>
                            <p className="text-xs text-blue-700">Secure UPI payment to {merchantConfig.pa}</p>
                          </div>
                        </div>
                        <button
                          onClick={handlePayment}
                          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                        >
                          Pay with GPay
                        </button>
                      </div>
                    )}

                    {method === 'upi' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-1 text-left">Enter UPI ID</label>
                          <input
                            type="text"
                            placeholder="e.g., demo@upi"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                          />
                        </div>
                        <button
                          onClick={handlePayment}
                          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50"
                          disabled={!upiId}
                        >
                          Verify & Pay
                        </button>
                      </div>
                    )}

                    {method === 'card' && (
                       <div className="space-y-4">
                       <div>
                         <label className="block text-xs font-bold text-gray-400 uppercase mb-1 text-left">Card Number</label>
                         <input
                           type="text"
                           placeholder="4111 1111 1111 1111"
                           value={cardDetails.number}
                           onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                           className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                         />
                       </div>
                       <div className="grid grid-cols-2 gap-4 text-left">
                         <div>
                           <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Expiry</label>
                           <input
                             type="text"
                             placeholder="MM/YY"
                             className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                           />
                         </div>
                         <div>
                           <label className="block text-xs font-bold text-gray-400 uppercase mb-1">CVV</label>
                           <input
                             type="password"
                             placeholder="***"
                             className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                           />
                         </div>
                       </div>
                       <button
                         onClick={handlePayment}
                         className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50"
                         disabled={!cardDetails.number}
                       >
                         Pay Securely
                       </button>
                     </div>
                    )}

                    {method === 'wallet' && (
                       <div className="space-y-4">
                       <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-3 text-left">
                         <Wallet className="text-orange-600" />
                         <div>
                           <p className="font-semibold text-orange-900 text-sm">Fintech Demo Wallet</p>
                           <p className="text-xs text-orange-700">Balance: ₹1,500.00</p>
                         </div>
                       </div>
                       <button
                         onClick={handlePayment}
                         className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                       >
                         Pay from Wallet
                       </button>
                     </div>
                    )}
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-4 text-gray-400">
                  <ShieldCheck size={16} />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Encrypted via Google Pay India API</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="status-view"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="min-h-[400px] flex items-center justify-center"
              >
                {renderStatus()}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Settings className="text-gray-800" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 text-left">Merchant Settings</h2>
              <p className="text-sm text-gray-500 text-left">Configure your Google Pay India API credentials</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <div>
                <label htmlFor="vpa-addr" className="block text-xs font-bold text-gray-400 uppercase mb-1 text-left">VPA Address (pa)</label>
                <input
                  id="vpa-addr"
                  type="text"
                  value={merchantConfig.pa}
                  onChange={(e) => setMerchantConfig({...merchantConfig, pa: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="merchant-name" className="block text-xs font-bold text-gray-400 uppercase mb-1 text-left">Merchant Name (pn)</label>
                <input
                  id="merchant-name"
                  type="text"
                  value={merchantConfig.pn}
                  onChange={(e) => setMerchantConfig({...merchantConfig, pn: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="merchant-cat" className="block text-xs font-bold text-gray-400 uppercase mb-1 text-left">Merchant Category (mc)</label>
                <input
                  id="merchant-cat"
                  type="text"
                  value={merchantConfig.mc}
                  onChange={(e) => setMerchantConfig({...merchantConfig, mc: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="txn-id" className="block text-xs font-bold text-gray-400 uppercase mb-1 text-left">Transaction ID (tr)</label>
                <input
                  id="txn-id"
                  type="text"
                  value={merchantConfig.tr}
                  onChange={(e) => setMerchantConfig({...merchantConfig, tr: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label htmlFor="txn-note" className="block text-xs font-bold text-gray-400 uppercase mb-1 text-left">Note (tn)</label>
                <input
                  id="txn-note"
                  type="text"
                  value={merchantConfig.tn}
                  onChange={(e) => setMerchantConfig({...merchantConfig, tn: e.target.value})}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="pt-5 flex justify-start">
                <a
                  href="https://developers.google.com/pay/india/api/web/create-payment-method"
                  target="_blank"
                  className="flex items-center gap-2 text-blue-600 text-sm font-semibold hover:underline"
                >
                  <ExternalLink size={16} /> API Documentation
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Code size={16} /> Implementation Code
              </h3>
              <button
                onClick={copyToClipboard}
                className="text-xs text-blue-600 font-bold flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto text-left">
              <pre className="text-blue-300 text-xs leading-relaxed font-mono">
                {codeSnippet}
              </pre>
            </div>
          </div>
        </motion.div>
      )}

      <p className="mt-8 text-gray-400 text-sm">UPI Business Integration Dashboard &middot; v2.0</p>
    </div>
  );
}

export default App;
