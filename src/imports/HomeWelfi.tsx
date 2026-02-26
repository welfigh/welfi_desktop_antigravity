import svgPaths from "./svg-12beq01mq3";
import img716 from "figma:asset/72384e84861ccea0025a5cb04af72b6dbb5d53f9.png";

function Background() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[844px] left-1/2 top-1/2 w-[390px]" data-name="Background">
      <div className="absolute inset-[-0.19%_-0.34%_-0.25%_0]" data-name="7 16">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={img716.src} />
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[22.4px] text-white">Hola, Fran</p>
    </div>
  );
}

function Frame9() {
  return <div className="absolute bg-[#e5582f] right-[-3px] rounded-[20px] size-[13px] top-[-3px]" />;
}

function Menu1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="menu">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="menu">
          <path d="M3 12H21" id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M3 6H21" id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M3 18H21" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Menu() {
  return (
    <div className="backdrop-blur-[5px] bg-[rgba(250,250,250,0.2)] content-stretch flex gap-[10px] items-start p-[10px] relative rounded-[15px] shrink-0" data-name="Menu">
      <Frame9 />
      <Menu1 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame4 />
      <Menu />
    </div>
  );
}

function Group1() {
  return (
    <div className="col-1 ml-0 mt-0 relative row-1 size-[14.617px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.6172 14.6172">
        <g id="Group 3091">
          <path d={svgPaths.p1b631280} fill="var(--fill-0, #B5C1EC)" id="?" />
          <circle cx="7.30859" cy="7.30859" id="Ellipse 5" r="6.64418" stroke="var(--stroke-0, #B5C1EC)" strokeWidth="1.32884" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <Group1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[5px] items-center relative shrink-0">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#b5c1ec] text-[14px]">Todo mi dinero</p>
      <Group />
    </div>
  );
}

function Rendimiento() {
  return (
    <div className="content-stretch flex gap-[5px] items-center px-[10px] py-[5px] relative rounded-[18px] shrink-0" data-name="Rendimiento">
      <div className="flex h-[4px] items-center justify-center relative shrink-0 w-[6.667px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="h-[6.667px] relative w-[4px]" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 6.66667">
              <path d="M4 6.66667L0 3.33333L4 0" fill="var(--fill-0, #CEF2C5)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#cef2c5] text-[13px] text-right">0.0%</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[10px] relative w-full">
          <Frame2 />
          <Rendimiento />
        </div>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="h-[11px] relative shrink-0 w-[8px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 11">
        <g id="Frame 3763">
          <path d="M-1.90719e-07 4L4 0L8 4" fill="var(--fill-0, white)" id="Vector" />
          <path d="M8 7L4 11L0 7" fill="var(--fill-0, white)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[3px] items-center justify-center relative shrink-0">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[15.6px] text-white">U$D</p>
      <Frame40 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[0] not-italic relative shrink-0 text-[0px] text-white">
        <span className="leading-[normal] text-[18.72px]">{`$  `}</span>
        <span className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] text-[38.82px]">4.560,00</span>
      </p>
      <Frame8 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
      <Frame15 />
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0 w-full">
      <Frame5 />
      <div className="h-[7.86px] relative shrink-0 w-[14.41px]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.4097 7.85986">
          <path clipRule="evenodd" d={svgPaths.p3a711700} fill="var(--fill-0, #FEFEFE)" fillOpacity="0.6" fillRule="evenodd" id="Vector" />
        </svg>
      </div>
    </div>
  );
}

function MenuButton() {
  return (
    <div className="backdrop-blur-[5px] bg-[rgba(255,255,255,0.2)] flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[13px]" data-name="Menu button">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[20px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[15.6px] text-center">Ingresar</p>
        </div>
      </div>
    </div>
  );
}

function MenuButton1() {
  return (
    <div className="backdrop-blur-[5px] bg-[rgba(255,255,255,0.2)] flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[13px]" data-name="Menu button">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[20px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[15.6px] text-center">Dólar MEP</p>
        </div>
      </div>
    </div>
  );
}

function MenuButton2() {
  return (
    <div className="backdrop-blur-[5px] bg-[rgba(255,255,255,0.2)] flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[13px]" data-name="Menu button">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between px-[20px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#fafafa] text-[15.6px] text-center">Retirar</p>
        </div>
      </div>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[15px] h-[40px] items-center justify-center relative shrink-0 w-full">
      <MenuButton />
      <MenuButton1 />
      <MenuButton2 />
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0 w-full">
      <Frame7 />
      <Frame35 />
      <Frame27 />
    </div>
  );
}

function WalletHome() {
  return (
    <div className="content-stretch flex flex-col gap-[15px] items-center px-[10px] relative shrink-0 w-[390px]" data-name="wallet home">
      <Frame28 />
      <Frame36 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="relative rounded-[20px] shrink-0 size-[9px]">
      <div aria-hidden="true" className="absolute border-2 border-[#e5582f] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function Frame44() {
  return (
    <div className="absolute content-stretch flex gap-[10px] items-center left-[25px] top-[32.14px]">
      <Frame10 />
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#808080] text-[15.6px]">Corto plazo</p>
    </div>
  );
}

function Frame11() {
  return (
    <div className="relative rounded-[20px] shrink-0 size-[9px]">
      <div aria-hidden="true" className="absolute border-2 border-[#e5582f] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function Frame17() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[15px] relative w-full">
          <Frame11 />
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#808080] text-[15.6px]">Mediano o largo plazo</p>
        </div>
      </div>
    </div>
  );
}

function Rendimiento1() {
  return (
    <div className="bg-[#cef2c5] content-stretch flex gap-[5px] items-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" data-name="Rendimiento">
      <div className="flex h-[4px] items-center justify-center relative shrink-0 w-[6.667px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="h-[6.667px] relative w-[4px]" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 6.66667">
              <path d="M4 6.66667L0 3.33333L4 0" fill="var(--fill-0, #0D9A68)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#0d9a68] text-[13px] text-right">0.9%</p>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex flex-col h-[26px] items-end justify-center relative shrink-0 w-full">
      <Rendimiento1 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center mr-[-5px] p-[5px] relative rounded-[12px] shrink-0 size-[30px] z-[4]">
      <div aria-hidden="true" className="absolute border border-[#f2f1f0] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.3)]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#101b42] text-[14px]">💻</p>
    </div>
  );
}

function Frame19() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center mr-[-5px] p-[5px] relative rounded-[12px] shrink-0 size-[30px] z-[3]">
      <div aria-hidden="true" className="absolute border border-[#f2f1f0] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.3)]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#101b42] text-[14px]">👵🏼</p>
    </div>
  );
}

function Frame20() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center mr-[-5px] p-[5px] relative rounded-[12px] shrink-0 size-[30px] z-[2]">
      <div aria-hidden="true" className="absolute border border-[#f2f1f0] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.3)]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#101b42] text-[14px]">🚗</p>
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center mr-[-5px] p-[5px] relative rounded-[12px] shrink-0 size-[30px] z-[1]">
      <div aria-hidden="true" className="absolute border border-[#f2f1f0] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.3)]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#101b42] text-[14px]">🌡️</p>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex isolate items-center justify-center pr-[5px] relative shrink-0">
      <Frame18 />
      <Frame19 />
      <Frame20 />
      <Frame22 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[15px] items-center justify-center min-h-px min-w-px relative w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#595959] text-[15.6px] text-center">Mis objetivos</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#141219] text-[0px]">
        <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] text-[15.6px]">$ 2.004,00</span>
        <span className="leading-[normal] text-[15px]">{` `}</span>
        <span className="leading-[normal] text-[10.83px]">U$D</span>
      </p>
      <Frame21 />
    </div>
  );
}

function Objetivos() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[190px] items-center justify-between overflow-clip p-[10px] relative rounded-[13px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.3)] shrink-0 w-[180px]" data-name="Objetivos">
      <Frame31 />
      <Frame30 />
    </div>
  );
}

function Rendimiento2() {
  return (
    <div className="bg-[#cef2c5] content-stretch flex gap-[5px] items-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" data-name="Rendimiento">
      <div className="flex h-[4px] items-center justify-center relative shrink-0 w-[6.667px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="h-[6.667px] relative w-[4px]" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 6.66667">
              <path d="M4 6.66667L0 3.33333L4 0" fill="var(--fill-0, #0D9A68)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#0d9a68] text-[13px] text-right">2.3%</p>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex flex-col h-[26px] items-end justify-center relative shrink-0 w-full">
      <Rendimiento2 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center mr-[-5px] p-[5px] relative rounded-[12px] shrink-0 size-[30px] z-[2]">
      <div aria-hidden="true" className="absolute border border-[#f2f1f0] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.3)]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#101b42] text-[14px]">📦</p>
    </div>
  );
}

function Frame25() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center justify-center mr-[-5px] p-[5px] relative rounded-[12px] shrink-0 size-[30px] z-[1]">
      <div aria-hidden="true" className="absolute border border-[#f2f1f0] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.3)]" />
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#101b42] text-[14px]">📦</p>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex isolate items-center justify-center pr-[5px] relative shrink-0">
      <Frame24 />
      <Frame25 />
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[15px] items-center justify-center min-h-px min-w-px relative w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#595959] text-[15.6px] text-center">Mis Packs</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[0] not-italic relative shrink-0 text-[#101b42] text-[0px]">
        <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] text-[15.6px]">$ 534,00</span>
        <span className="leading-[normal] text-[15px]">{` `}</span>
        <span className="leading-[normal] text-[10.83px]">U$D</span>
      </p>
      <Frame23 />
    </div>
  );
}

function Packs() {
  return (
    <div className="bg-white flex-[1_0_0] h-[190px] min-h-px min-w-px relative rounded-[13px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.3)]" data-name="Packs">
      <div className="flex flex-col items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center justify-between p-[10px] relative size-full">
          <Frame32 />
          <Frame33 />
        </div>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[10px] h-[190px] items-center justify-center relative rounded-[9px] shrink-0 w-full">
      <Objetivos />
      <Packs />
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame17 />
      <Frame16 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame41 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="relative rounded-[20px] shrink-0 size-[9px]">
      <div aria-hidden="true" className="absolute border-2 border-[#e5582f] border-solid inset-0 pointer-events-none rounded-[20px]" />
    </div>
  );
}

function Frame6() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[15px] relative w-full">
          <Frame12 />
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#808080] text-[15px]">Lo último en news</p>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[20px] h-[171.001px] items-start justify-center overflow-clip px-[14px] py-[26px] relative rounded-[20px] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.2)] shrink-0">
      <p className="leading-[40px] relative shrink-0 text-[40px] text-black">🎯</p>
      <p className="leading-[16px] relative shrink-0 text-[#141219] text-[14px] w-[225.002px] whitespace-pre-wrap">Parece que todavía no tienes objetivos de ahorro</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[20px] h-[171.001px] items-start justify-center overflow-clip px-[14px] py-[26px] relative rounded-[20px] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.2)] shrink-0">
      <p className="leading-[40px] relative shrink-0 text-[40px] text-black">🎯</p>
      <p className="leading-[16px] relative shrink-0 text-[#141219] text-[14px] w-[225.002px] whitespace-pre-wrap">Parece que todavía no tienes objetivos de ahorro</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex font-['Inter:Light',sans-serif] font-light gap-[14px] items-start not-italic relative shrink-0 w-[358.003px]">
      <Frame />
      <Frame1 />
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame6 />
      <Frame3 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <Frame42 />
    </div>
  );
}

function Frame43() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[20px] items-start left-[10px] top-[199.14px] w-[370px]">
      <Frame14 />
      <Frame13 />
    </div>
  );
}

function Rendimiento3() {
  return (
    <div className="bg-[#cef2c5] content-stretch flex gap-[5px] items-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" data-name="Rendimiento">
      <div className="flex h-[4px] items-center justify-center relative shrink-0 w-[6.667px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="h-[6.667px] relative w-[4px]" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 6.66667">
              <path d="M4 6.66667L0 3.33333L4 0" fill="var(--fill-0, #0D9A68)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#0d9a68] text-[13px] text-right">0.9%</p>
    </div>
  );
}

function Frame34() {
  return (
    <div className="content-stretch flex flex-col h-[26px] items-end justify-center relative shrink-0 w-full">
      <Rendimiento3 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-center justify-center min-h-px min-w-px not-italic relative w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#595959] text-[15.6px] text-center">Welfi Pesos</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[0] relative shrink-0 text-[#141219] text-[0px]">
        <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] text-[15.6px]">2.004,00</span>
        <span className="leading-[normal] text-[15px]">{` `}</span>
        <span className="leading-[normal] text-[10.83px]">ARS</span>
      </p>
    </div>
  );
}

function Objetivos1() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[121px] items-center justify-between left-[10px] overflow-clip p-[10px] rounded-[13px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.3)] top-[61.14px] w-[181px]" data-name="Objetivos">
      <Frame34 />
      <Frame37 />
    </div>
  );
}

function Rendimiento4() {
  return (
    <div className="bg-[#cef2c5] content-stretch flex gap-[5px] items-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" data-name="Rendimiento">
      <div className="flex h-[4px] items-center justify-center relative shrink-0 w-[6.667px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="h-[6.667px] relative w-[4px]" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 6.66667">
              <path d="M4 6.66667L0 3.33333L4 0" fill="var(--fill-0, #0D9A68)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#0d9a68] text-[13px] text-right">0.9%</p>
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex flex-col h-[26px] items-end justify-center relative shrink-0 w-full">
      <Rendimiento4 />
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-center justify-center min-h-px min-w-px not-italic relative w-full">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#595959] text-[15.6px] text-center">Welfi Dólares</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[0] relative shrink-0 text-[#141219] text-[0px]">
        <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] text-[15.6px]">2.004,00</span>
        <span className="leading-[normal] text-[15px]">{` `}</span>
        <span className="leading-[normal] text-[10.83px]">USD</span>
      </p>
    </div>
  );
}

function Objetivos2() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[121px] items-center justify-between left-[199px] overflow-clip p-[10px] rounded-[13px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.3)] top-[61.14px] w-[181px]" data-name="Objetivos">
      <Frame38 />
      <Frame39 />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[10px] top-[32.14px]">
      <Frame44 />
      <Frame43 />
      <Objetivos1 />
      <Objetivos2 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="bg-[#fafafa] h-[688px] relative rounded-tl-[18px] rounded-tr-[18px] shadow-[0px_0px_15px_0px_rgba(0,0,0,0.3)] shrink-0 w-[390px]">
      <Group2 />
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[5px] h-full items-start justify-center min-h-px min-w-px not-italic relative">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#595959] text-[15.6px]">Welfi pesos</p>
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[0] relative shrink-0 text-[#101b42] text-[#141219] text-[0px]">
        <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] text-[15.6px]">$ 2.004.000,00</span>
        <span className="leading-[normal] text-[10.83px]">{` AR$`}</span>
      </p>
    </div>
  );
}

function Rendimiento5() {
  return (
    <div className="bg-[#cef2c5] content-stretch flex gap-[5px] items-center px-[10px] py-[5px] relative rounded-[8px] shrink-0" data-name="Rendimiento">
      <div className="flex h-[4px] items-center justify-center relative shrink-0 w-[6.667px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="h-[6.667px] relative w-[4px]" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 6.66667">
              <path d="M4 6.66667L0 3.33333L4 0" fill="var(--fill-0, #0D9A68)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#0d9a68] text-[13px] text-right">0.9%</p>
    </div>
  );
}

function Welfipesos() {
  return (
    <div className="bg-white h-[79px] relative rounded-[13px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.3)] shrink-0 w-full" data-name="Welfipesos">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start justify-between pl-[30px] pr-[10px] py-[10px] relative size-full">
          <Frame26 />
          <Rendimiento5 />
        </div>
      </div>
    </div>
  );
}

export default function HomeWelfi() {
  return (
    <div className="bg-[#3246ff] content-stretch flex flex-col gap-[20px] items-center overflow-clip pt-[60px] relative rounded-[27.51px] size-full" data-name="Home welfi">
      <Background />
      <WalletHome />
      <Frame29 />
      <Welfipesos />
    </div>
  );
}