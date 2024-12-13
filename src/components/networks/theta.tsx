export function Theta(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={20} height={20} aria-labelledby="titleID" {...props}>
      <rect rx={6} fill="#1B1B1B" width={20} height={20} />
      <rect rx={6} fill="#FCFF5233" width={20} height={20} />
      <svg
        width={20}
        height={20}
        viewBox="0 0 433 433" // Ajustado para o viewBox do SVG original
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <defs>
          <linearGradient
            id="a"
            x1={112.27}
            y1={112.27}
            x2={320.73}
            y2={320.73}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset={0} stopColor="#2ab8e6" />
            <stop offset={0.53} stopColor="#29cad2" />
            <stop offset={1} stopColor="#2ee4be" />
          </linearGradient>
          <linearGradient
            id="b"
            x1={175.55}
            y1={175.91}
            x2={258.18}
            y2={258.54}
            xlinkHref="#a"
          />
        </defs>
        <path fill="#1b1f2b" d="M0 0h433v433H0z" />
        <path
          fill="#1b1f2b"
          strokeLinejoin="bevel"
          strokeWidth={27.222}
          stroke="url(#a)"
          d="M145.06 93.1h142.89v246.81H145.06z"
        />
        <path
          d="M259.8 255.47h-29.59v31h-26.7v-31h-29.59v-26.7h85.88zm0-76.5h-29.59v-31h-26.7v31h-29.59v26.7h85.88z"
          fill="url(#b)"
        />
      </svg>
    </svg>
  )
}
