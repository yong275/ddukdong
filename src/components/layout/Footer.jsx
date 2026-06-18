import { BookOpenText } from '@phosphor-icons/react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[--border] bg-[--surface]">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Logo */}
        <div className="flex items-center gap-2 font-extrabold text-[--primary] text-base">
          <BookOpenText size={20} weight="fill" />
          뚝딱동화
        </div>

        {/* Copyright */}
        <p className="text-xs text-[--text-muted]">
          &copy; 2026 뚝딱동화 · 누구나 주인공이 되는 그림동화
        </p>
      </div>
    </footer>
  );
}
