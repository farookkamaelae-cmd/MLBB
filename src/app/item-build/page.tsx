'use client';

import React from 'react';

export default function ItemBuildPage() {
  const items = [
    { name: 'Dominance Ice', category: 'Defense', effect: 'ลดการฮีลและโล่ของศัตรู 50% + ลดความเร็วโจมตี 30%', counterFor: 'Esmeralda, Estes, Ruby, WanWan' },
    { name: 'Antique Cuirass', category: 'Defense', effect: 'ลดพลังโจมตีกายภาพของศัตรูเมื่อถูกโจมตีด้วยสกิล', counterFor: 'Fanny, Saber, Hayabusa, Paquito' },
    { name: "Athena's Shield", category: 'Defense', effect: 'ลด Magic Damage มหาศาลในจังหวะโดน Burst สกิลเวท', counterFor: 'Eudora, Kadita, Kagura, Harley' },
    { name: 'Radiant Armor', category: 'Defense', effect: 'ลด Magic Damage ต่อเนื่องแบบ Poke/DPS', counterFor: "Valir, Chang'e, Yve, Kimmy" },
    { name: 'Sea Halberd', category: 'Attack', effect: 'ตัดฮีล Physical + เพิ่มความเสียหายใส่ตัวที่มี HP สูงกว่า', counterFor: 'Tanks, Esmeralda, Ursub' },
    { name: 'Wind of Nature', category: 'Attack', effect: 'อมตะต่อการโจมตีกายภาพทั้งหมดเป็นเวลา 2 วินาที', counterFor: 'Aldous, Natalia, Fanny, Bruno' },
  ];

  return (
    <div className="p-4 sm:p-8 space-y-6 font-mono max-w-6xl mx-auto">
      <div className="border-b border-white/10 pb-4 space-y-1">
        <h1 className="text-2xl font-extrabold text-white uppercase flex items-center gap-2">
          🔨 ITEM BUILD & COUNTER ITEMS (คู่มือไอเทมแก้ทาง)
        </h1>
        <p className="text-xs text-slate-400">
          ไอเทมสำคัญตามสถานการณ์เพื่อแก้ทางฮีโร่และสายการเล่นเฉพาะในเกม
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.name} className="bg-[#121317] border border-white/10 hover:border-blue-500/50 rounded-2xl p-5 space-y-3 transition shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span className="text-blue-400">🛡️</span> {item.name}
              </h3>
              <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-400">
                {item.category}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-blue-400">คุณสมบัติ:</strong> {item.effect}
            </p>

            <div className="bg-[#0b0c0e] p-2.5 rounded-xl text-xs border border-white/5">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">ใช้แก้ทางฮีโร่:</span>
              <span className="text-emerald-400 font-bold">{item.counterFor}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
