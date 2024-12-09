export function Polygon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={20} height={20} aria-labelledby="titleID" {...props}>
      <rect rx={6} fill="#1B1B1B" width={20} height={20} />
      <rect rx={6} fill="#9558FF33" width={20} height={20} />
      <svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        <path
          d="M15.88 14.924l3.795-2.214a.66.66 0 00.325-.57V7.713a.662.662 0 00-.325-.57L15.879 4.93a.649.649 0 00-.651 0l-3.796 2.213a.66.66 0 00-.325.57v7.912l-2.661 1.552-2.662-1.552v-3.104l2.662-1.552 1.755 1.024V9.91l-1.43-.835a.648.648 0 00-.65 0L4.325 11.29a.66.66 0 00-.325.57v4.427c0 .234.125.453.325.57l3.796 2.213c.2.117.45.117.651 0l3.796-2.213a.66.66 0 00.325-.57V8.375l.048-.028 2.613-1.524 2.662 1.552v3.104l-2.662 1.552-1.753-1.022v2.082l1.427.833c.201.117.45.117.651 0z"
          fill="#9558FF"
        />
      </svg>
    </svg>
  )
}
