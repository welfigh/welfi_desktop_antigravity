import svgPaths from "./svg-r2wycp4wzd";

function ChevronLeft() {
  return (
    <div className="relative shrink-0 size-[26.41px]" data-name="chevron-left">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 26.4096 26.4096">
        <g id="chevron-left">
          <path d="M21 13.2H4" id="Vector" stroke="var(--stroke-0, #141219)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p3dabb7c7} id="Vector_2" stroke="var(--stroke-0, #141219)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function TopNavegation() {
  return (
    <div className="col-1 content-stretch flex gap-[10px] items-center ml-[2828.75px] mt-0 px-[15px] relative row-1 w-[390px]" data-name="top navegation">
      <ChevronLeft />
    </div>
  );
}

function Frame() {
  return (
    <div className="col-1 content-stretch flex items-center justify-between leading-[normal] ml-[2828.75px] mt-[46.41px] not-italic px-[15px] relative row-1 text-[15.6px] w-[390px]">
      <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-[#595959]">ARS disponibles</p>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[#141219]">{`$1.000,00 `}</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="h-[70px] overflow-clip relative rounded-[14.305px] shrink-0 w-[79.229px]">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[calc(50%-23.1px)] not-italic text-[#595959] text-[15.6px] top-[calc(50%-8.69px)]">ARS</p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] h-full items-center justify-center min-h-px min-w-px overflow-clip py-[8px] relative rounded-[14.305px]">
      <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#141219] text-[38.82px]">$ 1.000,00</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="col-1 content-stretch flex h-[70px] items-start justify-center ml-[2828.75px] mt-[150.41px] relative row-1 w-[390px]">
      <Frame2 />
      <Frame3 />
    </div>
  );
}

function Rendimiento() {
  return (
    <div className="bg-[rgba(212,255,202,0.15)] content-stretch flex gap-[77.517px] items-center opacity-0 px-[155.034px] py-[77.517px] relative rounded-[281.225px] shrink-0" data-name="Rendimiento">
      <div className="flex h-[62.014px] items-center justify-center relative shrink-0 w-[103.356px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-90">
          <div className="h-[103.356px] relative w-[62.014px]" data-name="Vector">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 62.0138 103.356">
              <path d={svgPaths.p163e4140} fill="var(--fill-0, #CEF2C5)" id="Vector" />
            </svg>
          </div>
        </div>
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#cef2c5] text-[201.545px] text-right">0.0%</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="col-1 content-stretch flex items-center justify-between ml-0 mt-[279.41px] relative row-1 w-[6047.504px]">
      <Rendimiento />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#3246ff] col-1 h-[61px] ml-[2845.75px] mt-[698px] overflow-clip relative rounded-[14.416px] row-1 shadow-[0px_2.016px_8.062px_0px_rgba(0,0,0,0.25)] w-[357px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Roboto:Bold',sans-serif] font-bold leading-[normal] left-[calc(50%+0.1px)] text-[#f9f9f9] text-[15.525px] text-center top-[calc(50%-8.26px)]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Invertir en este fondo
      </p>
    </div>
  );
}

function Group4() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <TopNavegation />
      <Frame />
      <div className="col-1 h-0 ml-[2828.75px] mt-[85.41px] relative row-1 w-[390px]">
        <div className="absolute inset-[-0.5px_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 390 1.00001">
            <path d="M0 0.500004H390" id="Vector 49" stroke="var(--stroke-0, #BFBFBF)" strokeWidth="1.00001" />
          </svg>
        </div>
      </div>
      <p className="-translate-x-1/2 col-1 font-['Inter:Semi_Bold',sans-serif] font-semibold h-[25px] leading-[normal] ml-[3023.75px] mt-[105.41px] not-italic relative row-1 text-[#141219] text-[18.72px] text-center w-[390px] whitespace-pre-wrap">Monto a invertir</p>
      <Frame4 />
      <Frame5 />
      <Button />
    </div>
  );
}

function HomeWelfi() {
  return (
    <div className="absolute bg-[#fafafa] content-stretch flex flex-col h-[844px] items-center left-0 overflow-clip pb-[22.008px] pt-[60px] rounded-[27.51px] top-0 w-[390px]" data-name="Home welfi">
      <Group4 />
    </div>
  );
}

function Group1() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[9.804px]">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[9.804px] items-center justify-center leading-[normal] not-italic px-[4.455px] py-[8.909px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[#3246ff] text-[13.898px]">ARS 0,25</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal min-w-full relative shrink-0 text-[#595959] text-[11.582px] text-center w-[min-content] whitespace-pre-wrap">Por día</p>
        </div>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[9.804px]">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[9.804px] items-center justify-center leading-[normal] not-italic px-[4.455px] py-[8.909px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[#3246ff] text-[13.898px]">ARS 587</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal min-w-full relative shrink-0 text-[#595959] text-[11.582px] text-center w-[min-content] whitespace-pre-wrap">Por mes</p>
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative rounded-[9.804px]">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[9.804px] items-center justify-center leading-[normal] not-italic px-[4.455px] py-[8.909px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold relative shrink-0 text-[#3246ff] text-[13.898px]">ARS 100</p>
          <p className="font-['Inter:Regular',sans-serif] font-normal min-w-full relative shrink-0 text-[#595959] text-[11.582px] text-center w-[min-content] whitespace-pre-wrap">Por año</p>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute bg-white content-stretch flex h-[89.091px] items-center justify-center left-[21.35px] rounded-[11.582px] top-[448px] w-[347.455px]">
      <Group1 />
      <div className="h-[53.455px] relative shrink-0 w-0">
        <div className="absolute inset-[0_-0.45px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0.89091 53.4546">
            <path d="M0.445455 0V53.4546" id="Vector 440" stroke="var(--stroke-0, #EAEBEC)" strokeWidth="0.89091" />
          </svg>
        </div>
      </div>
      <Group2 />
      <div className="h-[53.455px] relative shrink-0 w-0">
        <div className="absolute inset-[0_-0.45px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 0.89091 53.4546">
            <path d="M0.445455 0V53.4546" id="Vector 440" stroke="var(--stroke-0, #EAEBEC)" strokeWidth="0.89091" />
          </svg>
        </div>
      </div>
      <Group />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[16px] top-[350px]">
      <div className="absolute bg-white border-[#eaebec] border-[0.891px] border-solid h-[196px] left-[16px] rounded-[9.8px] top-[350px] w-[358.146px]" />
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium h-[50.782px] leading-[normal] left-[139.84px] not-italic text-[#141219] text-[37.002px] top-[366px] w-[109.582px] whitespace-pre-wrap">6,25%</p>
      <Frame1 />
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[194.5px] not-italic text-[#595959] text-[11.582px] text-center top-[414.07px]">Rendimiento anual estimado</p>
      <p className="-translate-x-1/2 absolute font-['Inter:Italic',sans-serif] font-normal italic leading-[normal] left-[195px] text-[#595959] text-[11.582px] text-center top-[566px] w-[262px] whitespace-pre-wrap">Las proyecciones son estimadas y no representan una promesa de rentabilidad.</p>
      <div className="absolute h-0 left-[43.62px] top-[448px] w-[302.909px]">
        <div className="absolute inset-[-0.89px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 302.909 0.89091">
            <line id="Line 254" stroke="var(--stroke-0, #EAEBEC)" strokeWidth="0.89091" x2="302.909" y1="0.445455" y2="0.445455" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents left-[16px] top-[350px]">
      <Group3 />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents left-0 top-0">
      <HomeWelfi />
      <Group5 />
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents left-0 top-0">
      <Group6 />
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents left-0 top-0">
      <Group7 />
    </div>
  );
}

export default function Group9() {
  return (
    <div className="relative size-full">
      <Group8 />
    </div>
  );
}