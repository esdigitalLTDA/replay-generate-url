export function Celo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={20} height={20} aria-labelledby="titleID" {...props}>
      <rect rx={6} fill="#1B1B1B" width={20} height={20} />
      <rect rx={6} fill="#FCFF5233" width={20} height={20} />
      <svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M17.984 5.953H6.016v11.969h11.968v-4.178h-1.987a4.383 4.383 0 01-3.988 2.584 4.41 4.41 0 01-4.4-4.4c-.003-2.412 1.97-4.381 4.4-4.381 1.797 0 3.338 1.094 4.022 2.653h1.953V5.953z"
          fill="#FCFF52"
        />
      </svg>
    </svg>
  )
}
