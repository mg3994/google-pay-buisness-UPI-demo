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
  ShieldCheck
} from 'lucide-react';

const UPI_METHODS = [
  { id: 'gpay', name: 'Google Pay', icon: Smartphone, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'upi', name: 'UPI ID', icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-50' },
  { id: 'card', name: 'Card', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
  { id: 'wallet', name: 'Wallet', icon: Wallet, color: 'text-orange-600', bg: 'bg-orange-50' },
];

function App() {
  const [amount, setAmount] = useState('100.00');
  const [method, setMethod] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [status, setStatus] = useState('idle'); // idle, processing, success, failure
  const [errorMsg, setErrorMsg] = useState('');

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

  const renderStatus = () => {
    if (status === 'processing') {
      return (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center p-8 text-center"
        >
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800">Processing Payment</h2>
          <p className="text-gray-500 mt-2">Please do not refresh or close the page</p>
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
          <p className="text-gray-600 mt-2">Amount: ₹{amount}</p>
          <p className="text-sm text-gray-400 mt-1 flex items-center justify-center gap-1">
            <ShieldCheck size={14} /> Transaction Secure
          </p>
          <button
            onClick={reset}
            className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            Make Another Payment
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      {/* Banner Disclaimer */}
      <div className="w-full max-w-md bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-lg mb-6 flex items-start gap-3 shadow-sm">
        <Info className="shrink-0 mt-0.5" size={18} />
        <p className="text-xs font-medium">
          <strong>Demo Mode:</strong> This is a UI demonstration. No real transactions are processed. Use test credentials provided in placeholders.
        </p>
      </div>

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
                  <p className="text-sm text-gray-500">Merchant: UPI Demo Business</p>
                </div>
                <div className="text-right min-w-[120px]">
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Total Amount</p>
                  <div className="flex items-center justify-end gap-1">
                    <span className="text-2xl font-black text-blue-600">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="text-2xl font-black text-blue-600 w-24 text-right focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
                      <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                        <Smartphone className="text-blue-600" />
                        <div>
                          <p className="font-semibold text-blue-900 text-sm">Pay with Google Pay</p>
                          <p className="text-xs text-blue-700">One-tap secure payment via GPay app</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 italic text-center">In this demo, this will simulate an app switch flow.</p>
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
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Enter UPI ID</label>
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
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Card Number</label>
                        <input
                          type="text"
                          placeholder="4111 1111 1111 1111"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
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
                      <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl flex items-center gap-3">
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
                <span className="text-[10px] uppercase tracking-widest font-bold">Secure Demo Encryption</span>
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

      <p className="mt-8 text-gray-400 text-sm">Developed for UPI Business Integration Demo</p>
    </div>
  );
}

export default App;
