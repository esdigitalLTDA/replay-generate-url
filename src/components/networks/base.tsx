export function Base(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={20} height={20} aria-labelledby="titleID" {...props}>
      <rect rx={6} fill="#1B1B1B" width={20} height={20} />
      <rect rx={6} fill="#0052FF33" width={20} height={20} />
      <svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M20 12c0 4.418-3.588 8-8.014 8-4.2 0-7.644-3.224-7.986-7.328h10.593v-1.345H4C4.342 7.225 7.787 4 11.986 4 16.412 4 20 7.582 20 12z"
          fill="#0052FF"
        />
      </svg>
    </svg>
  )
}
