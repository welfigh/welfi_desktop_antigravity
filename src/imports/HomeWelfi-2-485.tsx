import svgPaths from "./svg-ls7tm5pbfo";

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
    <div className="relative shrink-0 w-full" data-name="top navegation">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[15px] relative w-full">
          <ChevronLeft />
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[143.811px]">
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#595959] text-[15.6px]">Monto a invertir</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full">
      <Frame6 />
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#141219] text-[15.6px]">ARS 1.000,00</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#f2f1f0] relative rounded-[22.008px] shrink-0 w-full">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[20px] items-center px-[20px] py-[30px] relative w-full">
          <p className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#1f1d1c] text-[22.4px]">¿Estamos ok?</p>
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[#595959] text-[15.6px]">Welfi Pesos</p>
          <div className="h-0 relative shrink-0 w-full">
            <div className="absolute inset-[-0.55px_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 330 1.1004">
                <path d="M0 0.5502H330" id="Line 236" stroke="var(--stroke-0, #BFBFBF)" strokeDasharray="2.2 2.2" strokeWidth="1.1004" />
              </svg>
            </div>
          </div>
          <Frame />
          <div className="font-['Inter:Medium',sans-serif] font-medium leading-[normal] min-w-full not-italic relative shrink-0 text-[#595959] text-[10.83px] w-[min-content] whitespace-pre-wrap">
            <p className="mb-0">Al confirmar la operacion, pasará a encontrarse en estado “pendiente”.</p>
            <p>La misma puede demorar hasta 48 hs hábiles en concretarse.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return <div className="-translate-x-1/2 -translate-y-1/2 absolute border-[#bfbfbf] border-[1.5px] border-solid left-1/2 rounded-[49px] size-[22px] top-[calc(50%-0.09px)]" />;
}

function CheckCircle() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="check-circle">
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
      <CheckCircle />
      <p className="flex-[1_0_0] font-['Inter:Regular','Noto_Sans:Regular',sans-serif] font-normal leading-[0] min-h-px min-w-px not-italic relative text-[#595959] text-[0px] whitespace-pre-wrap">
        <span className="leading-[normal] text-[12px]">{`Acepto `}</span>
        <span className="leading-[normal] text-[#3246ff] text-[13px]">términos y condiciones de Welfi</span>
        <span className="leading-[normal] text-[12px]">{` y el `}</span>
        <span className="leading-[normal] text-[#3246ff] text-[13px]">reglamento de gestión del fondo.</span>
      </p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center p-[20px] relative w-full">
          <Frame3 />
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[20px] items-center min-h-px min-w-px relative w-full">
      <Frame1 />
      <Frame4 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#3246ff] content-stretch flex h-[60px] items-center justify-center overflow-clip px-[108px] py-[16px] relative rounded-[13px] shadow-[0px_2px_5px_0px_rgba(0,0,0,0.2)] shrink-0" data-name="Button">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-[15.6px] text-center text-white">Confirmar</p>
    </div>
  );
}

export default function HomeWelfi() {
  return (
    <div className="bg-[#fafafa] content-stretch flex flex-col gap-[20px] items-center overflow-clip pb-[20px] pt-[60px] px-[10px] relative rounded-[27.51px] size-full" data-name="Home welfi">
      <TopNavegation />
      <Frame5 />
      <Button />
    </div>
  );
}