import imgWelIlustracionesInversionConfigurada from "figma:asset/fd2c423c6d41ed3ce9009258405303a91f9a3b68.png";

function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[27.51px] items-center justify-center min-h-px min-w-px relative w-full">
      <div className="h-[295px] relative shrink-0 w-[256px]" data-name="WEL_Ilustraciones_InversionConfigurada">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgWelIlustracionesInversionConfigurada.src} />
      </div>
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[#1f1d1c] text-[26.96px] text-center w-[309.212px] whitespace-pre-wrap">¡Listo!</p>
      <div className="font-['Noto_Sans:Light',sans-serif] font-light h-[104.538px] leading-[normal] relative shrink-0 text-[#1f1d1c] text-[0px] text-center w-[351.028px] whitespace-pre-wrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100" }}>
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold mb-0 not-italic text-[#141219] text-[15.6px]">Tu inversión fue configurada</p>
        <p className="mb-0 text-[17.606px]">&nbsp;</p>
        <p className="font-['Inter:Regular',sans-serif] font-normal not-italic text-[#595959] text-[15.6px]">Esta operación puede demorar hasta 48 hs hábiles en ejecutarse.</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#3246ff] h-[60px] overflow-clip relative rounded-[13px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.25)] shrink-0 w-[320px]" data-name="Button">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] left-[calc(50%+0.01px)] not-italic text-[15.6px] text-center text-white top-[calc(50%-8.69px)]">Ir al inicio</p>
    </div>
  );
}

export default function HomeWelfi() {
  return (
    <div className="bg-[#fafafa] content-stretch flex flex-col gap-[20px] items-center overflow-clip pb-[20px] pt-[60px] px-[15px] relative rounded-[27.51px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] size-full" data-name="Home welfi">
      <Frame />
      <Button />
    </div>
  );
}