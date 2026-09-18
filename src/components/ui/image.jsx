import * as React from "react"

const ImageFallback = React.forwardRef(({ alt, className, ...props }, ref) => (
  <div
    ref={ref}
    role="img"
    aria-label={alt || "Image unavailable"}
    className={`grid place-items-center overflow-hidden rounded-[inherit] bg-secondary text-muted-foreground ${className || ""}`}
    {...props}
  >
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-10 w-10 opacity-50"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9" r="1.5" />
      <path d="m21 15-4.5-4.5L7 20" />
    </svg>
  </div>
))
ImageFallback.displayName = "ImageFallback"

const Image = React.forwardRef(
  (
    {
      src,
      alt = "",
      className,
      fittingType = "fill",
      focalPointX: _focalPointX,
      focalPointY: _focalPointY,
      originWidth: _originWidth,
      originHeight: _originHeight,
      quality: _quality,
      onError,
      onLoad,
      ...props
    },
    ref
  ) => {
    const [failedSource, setFailedSource] = React.useState(null)
    const hasSource = typeof src === "string" && src.trim().length > 0
    const failed = failedSource === src

    React.useEffect(() => {
      setFailedSource(null)
    }, [src])

    if (!hasSource || failed) {
      return <ImageFallback ref={ref} alt={alt} className={className} {...props} />
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={className}
        {...props}
        style={{
          objectFit: fittingType === "fit" ? "contain" : "cover",
          ...props.style,
        }}
        onLoad={onLoad}
        onError={(event) => {
          setFailedSource(src)
          onError?.(event)
        }}
      />
    )
  }
)

Image.displayName = "Image"

export { Image }
