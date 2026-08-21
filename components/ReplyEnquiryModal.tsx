import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { X, Send, Mail, User, Calendar as CalendarIcon, FileText } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

interface ReplyEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  enquiryData: any | null;
}

export default function ReplyEnquiryModal({ isOpen, onClose, enquiryData }: ReplyEnquiryModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (isOpen && enquiryData) {
      setSubject(`Re: ${enquiryData.subject || 'Your Inquiry'}`);
      setMessage(`Dear ${enquiryData.name.split(' ')[0]},\n\nThank you for reaching out to us regarding your interest in ${enquiryData.packageName || enquiryData.packageType || 'our services'}.\n\n...\n\nBest regards,\nSkyGo Team`);
    }
  }, [isOpen, enquiryData]);

  if (!isOpen || !enquiryData) return null;

  const handleSendReply = async () => {
    setIsSending(true);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: enquiryData.email,
          subject: subject,
          text: message,
          enquiryId: enquiryData._id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }
      
      alert("Reply sent successfully via Email!");
      onClose();
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Failed to send reply. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#F5EFE6] rounded-[40px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/20">
        
        {/* Left Side: Original Enquiry Context */}
        <div className="w-full md:w-5/12 bg-white p-8 border-r border-gray-100 overflow-y-auto hidden md:block">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-black text-[#111827] uppercase tracking-wider">{enquiryData.name}</p>
              <p className="text-xs font-bold text-gray-400">{enquiryData.email}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Original Message</p>
              <p className="text-sm text-gray-700 leading-relaxed font-medium">"{enquiryData.message}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <FileText className="h-4 w-4 text-gray-400 mb-2" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Interest</p>
                <p className="text-xs font-bold text-[#111827] mt-1 line-clamp-2">{enquiryData.packageName || enquiryData.packageType || 'General'}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <CalendarIcon className="h-4 w-4 text-gray-400 mb-2" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                <p className="text-xs font-bold text-[#111827] mt-1">{new Date(enquiryData.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {enquiryData.phone && (
              <div className="flex items-center gap-3 text-sm font-bold text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase tracking-widest text-[#6B1F2A]">Phone:</span> {enquiryData.phone}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Reply Template */}
        <div className="w-full md:w-7/12 flex flex-col h-[80vh] md:h-auto">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
            <div>
              <h2 className="text-2xl font-black text-[#111827] tracking-tight uppercase">Compose Reply</h2>
              <p className="text-xs font-bold text-[#6B1F2A] uppercase tracking-[0.2em] mt-1">To: {enquiryData.email}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-10 w-10 p-0 rounded-2xl bg-gray-50 hover:bg-red-50 hover:text-red-500 transition-colors">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-8 flex-1 overflow-y-auto space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Subject</label>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-14 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-[#6B1F2A] bg-white font-semibold text-gray-900"
                placeholder="Email Subject"
              />
            </div>
            
            <div className="space-y-2 flex-1 flex flex-col h-full min-h-[300px]">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 flex items-center gap-2">
                <Mail className="h-3 w-3" /> Message Body
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 rounded-[24px] border-none shadow-sm focus:ring-2 focus:ring-[#6B1F2A] p-6 bg-white resize-none font-medium text-gray-700 leading-relax"
                placeholder="Type your reply here..."
              />
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 bg-white shrink-0 flex justify-end gap-3 rounded-br-[40px]">
            <Button
              variant="outline"
              onClick={onClose}
              className="h-14 px-8 rounded-2xl border-gray-200 font-black uppercase tracking-widest text-[#111827] hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendReply}
              disabled={isSending}
              className="h-14 px-8 rounded-2xl bg-[#111827] hover:bg-[#6B1F2A] text-white font-black uppercase tracking-widest shadow-xl shadow-[#111827]/10 flex items-center gap-3 transition-colors shrink-0"
            >
              {isSending ? 'Sending...' : (
                <>
                  Send Reply
                  <Send className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
