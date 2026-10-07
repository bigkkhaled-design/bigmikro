import React from 'react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { 
  X, 
  HelpCircle, 
  ShieldAlert, 
  Terminal, 
  Key, 
  Network, 
  Server, 
  LifeBuoy 
} from 'lucide-react';

interface QuickHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const QuickHelpModal: React.FC<QuickHelpModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  if (!isOpen) return null;

  const isAr = lang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                {isAr ? 'دليل ومفكرة ميكروتك السريعة (BigMikro Guide)' : 'MikroTik Quick Guide & Cheatsheet'}
              </h2>
              <p className="text-xs text-slate-400">
                {isAr ? 'أهم الأوامر والمنافذ والافتراضيات لمدراء أنظمة ميكروتك' : 'Essential defaults, ports, and emergency recovery tips'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 text-xs text-slate-300 leading-relaxed">
          
          {/* Section 1: Default Credentials */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Key className="w-4 h-4" />
              <span>{isAr ? 'الإعدادات الافتراضية للراوتر المصنعي' : 'Default Factory Router Settings'}</span>
            </div>
            <ul className="space-y-1.5 pl-4 rtl:pl-0 rtl:pr-4 list-disc text-slate-300">
              <li>
                <strong>{isAr ? 'عنوان الآي بي الافتراضي:' : 'Default IP:'}</strong>{' '}
                <code className="text-emerald-400 bg-slate-900 px-1 py-0.5 rounded">192.168.88.1/24</code> ({isAr ? 'على منافذ LAN و Bridge' : 'on LAN ports ether2-ether5 & bridge'})
              </li>
              <li>
                <strong>{isAr ? 'اسم المستخدم الافتراضي:' : 'Default Username:'}</strong>{' '}
                <code className="text-cyan-400 bg-slate-900 px-1 py-0.5 rounded">admin</code>
              </li>
              <li>
                <strong>{isAr ? 'كلمة المرور الافتراضية:' : 'Default Password:'}</strong>{' '}
                {isAr 
                  ? 'فارغة (بدون كلمة سر في الأجهزة القديمة) أو مطبوعة على الملصق الخلفي في الموديلات الحديثة.'
                  : 'Empty (no password on older units) or printed on device sticker (RouterOS 7+ default).'}
              </li>
              <li>
                <strong>{isAr ? 'الدخول عبر الماك:' : 'Connect via MAC:'}</strong>{' '}
                {isAr
                  ? 'إذا فقدت عنوان الآي بي، يمكنك دائماً الاتصال براوتر ميكروتك عبر برنامج Winbox باستخدام عنوان MAC مباشرة بفضل بروتوكول MAC-Telnet.'
                  : 'If IP is lost, connect via WinBox using MAC address directly over Layer 2 (MAC-Telnet).'}
              </li>
            </ul>
          </div>

          {/* Section 2: RouterOS API Ports */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Network className="w-4 h-4" />
              <span>{isAr ? 'منافذ واجهة برمجة ميكروتك (API Ports)' : 'MikroTik API Ports Explained'}</span>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-mono font-bold text-cyan-400">Port 8728 (TCP) — Plain RouterOS API</span>
                <p className="mt-1 text-slate-400">
                  {isAr 
                    ? 'المنفذ الثنائي المباشر لمكتبات Python و Node.js و PHP. سريع جداً لكنه غير مشفر عبر الشبكة.'
                    : 'Binary protocol for custom software & scripts. Fast execution, but unencrypted over local LAN.'}
                </p>
                <code className="block mt-1.5 text-[11px] text-emerald-400 bg-slate-950 p-1 rounded font-mono">
                  /ip service enable api
                </code>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-mono font-bold text-indigo-400">Port 8729 (TCP) — RouterOS API-SSL</span>
                <p className="mt-1 text-slate-400">
                  {isAr 
                    ? 'النسخة المشفرة بشهادة TLS/SSL. تضمن أمان نقل الأوامر وكلمات المرور عند التحكم بالراوتر عبر الإنترنت.'
                    : 'Encrypted with TLS/SSL certificate. Protects credentials and payloads across untrusted networks.'}
                </p>
                <code className="block mt-1.5 text-[11px] text-indigo-300 bg-slate-950 p-1 rounded font-mono">
                  /ip service enable api-ssl
                </code>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-mono font-bold text-sky-400">Port 443 / 80 — RouterOS v7 REST API</span>
                <p className="mt-1 text-slate-400">
                  {isAr 
                    ? 'ميزة جديدة في نظام v7 تتيح استدعاء بيانات الراوتر بصيغة JSON باستخدام استدعاءات RESTful التقليدية (GET, POST).'
                    : 'Native RESTful API introduced in RouterOS v7. Accessible via HTTPS port 443 with JSON payloads.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Safe Mode & Recovery */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-850 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>{isAr ? 'الوضع الآمن وطرق الإنقاذ (Emergency & Safe Mode)' : 'Safe Mode & Emergency Recovery'}</span>
            </div>
            <div className="space-y-1.5 text-slate-300">
              <p>
                <strong>Safe Mode (اختصار لوحة المفاتيح Ctrl + X):</strong>{' '}
                {isAr
                  ? 'عند الضغط على Ctrl + X في طرفية ميكروتك، يدخل الراوتر في الوضع الآمن. إذا تسبب أمر في قطع اتصالك بالراوتر، يقوم ميكروتك تلقائياً بإلغاء التغييرات واستعادة الإعدادات السابقة بعد ثوانٍ.'
                  : 'Press Ctrl+X in Terminal or click "Safe Mode" button in WinBox. If your command disconnects you, RouterOS automatically reverts all changes.'}
              </p>
              <p>
                <strong>{isAr ? 'زر إعادة الضبط (Reset Button):' : 'Hardware Reset Button Timing:'}</strong>{' '}
                {isAr
                  ? 'اضغط زر Reset ثم صل الكهرباء: انتظر 5 ثوانٍ لمسح التكوين، أو 10 ثوانٍ للدخول في وضع البوت المؤقت، أو 15 ثانية لوضع Netinstall لإعادة تثبيت السوفتوير من الصفر.'
                  : 'Hold Reset button and power on: 5s resets configuration to default, 10s clears CAPsMAN/backup, 15s enters Netinstall mode for full OS reflash.'}
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-end bg-slate-900/95 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-md"
          >
            {isAr ? 'إغلاق الدليل' : 'Close Guide'}
          </button>
        </div>
      </div>
    </div>
  );
};
