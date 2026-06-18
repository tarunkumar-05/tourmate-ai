import { CreditCard, Sparkles } from 'lucide-react';

export default function PaymentsPage() {
  return (
    <div className="space-y-8 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-heading font-extrabold text-gray-900 mb-2">Payments & Billing</h1>
        <p className="text-gray-500">Manage your transactions, receipts, and spending history.</p>
      </div>

      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center p-12 text-center relative overflow-hidden min-h-[400px]">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mb-6 relative">
            <CreditCard className="w-12 h-12 text-primary" />
            <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
          </div>
          
          <h2 className="text-3xl font-heading font-extrabold text-gray-900 mb-4 tracking-tight">
            We are coming with the best plans!
          </h2>
          
          <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
            Our secure billing and payment portal is currently undergoing an exciting upgrade. 
            Soon, you'll be able to manage all your trip invoices and subscriptions right here.
          </p>
          
          <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-600">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            Rolling out soon
          </div>
        </div>
      </div>
    </div>
  );
}
