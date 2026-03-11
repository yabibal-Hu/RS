import { useRef, useEffect, useState } from "react";
// import "@fontsource/cormorant-garamond";

import { useLocation } from "react-router";

interface LocationState {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  courseName?: string;
  credits?: string;
  trainingStart?: string;
  trainingEnd?: string;
}

interface Certificate {
  img: string;
  nameWidth: number;
  nameHeight: number;
  nameX: number;
  nameY: number;
  imageX?: number;
  imageY?: number;
  imageWidth?: number;
  imageHeight?: number;
  vipX?: number;
  vipY?: number;
  courseX?: number;
  courseY?: number;
  creditsX?: number;
  creditsY?: number;
  dateX?: number;
  dateY?: number;
}

interface Certificates {
  [key: string]: Certificate;
}

const GenerateCertificate = () => {
  const [certificate, setCertificate] = useState<string | null>(null);
  const [certificateText, setCertificateText] = useState<string>("");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [vip, setVip] = useState<string>("");
  const [fullNameInput, setFullNameInput] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const location = useLocation();
  const {
    firstName = "",
    middleName = "",
    lastName = "",
    courseName = "",
    credits = "",
    trainingStart = "",
    trainingEnd = "",
  } = (location.state as LocationState) || {};

  // Canvas dimensions
  const CANVAS_WIDTH = 1587;
  const CANVAS_HEIGHT = 2245;

  // certificate templates with adjusted coordinates for new dimensions
  const certificates: Certificates = {
    crt1: {
      img: "/images/crt1.png",
      nameWidth: 600,
      nameHeight: 50,
      nameX: CANVAS_WIDTH / 2, // 793.5
      nameY: 1470, // Below congratulations text
      imageX: CANVAS_WIDTH / 2, // 793.5
      imageY: 843, // Position for oval image
      imageWidth: 550, // Width for oval image
      imageHeight: 680, // Height for oval image
      vipX: 1450, // Right side position
      vipY: 620, // Top position
      courseX: 980, // Position for course name first line
      courseY: 1470, // Position for course name
      creditsX: 920, // Position for credits
      creditsY: 1790, // Position for credits
      dateX: 720, // Position for dates
      dateY: 1980, // Position for dates
    },
    crt2: {
      img: "/images/crt2.png",
      nameWidth: 600,
      nameHeight: 50,
      nameX: CANVAS_WIDTH / 2,
      nameY: 1270,
      imageX: CANVAS_WIDTH / 2,
      imageY: 790,
      imageWidth: 420,
      imageHeight: 420,
      vipX: 2350,
      vipY: 620,
      courseX: 280,
      courseY: 470,
      creditsX: 920,
      creditsY: 1790,
      dateX: 720,
      dateY: 1980,
    },
  };

  // vip list 1-11
  const vipList: string[] = [
    "VIP 1",
    "VIP 2",
    "VIP 3",
    "VIP 4",
    "VIP 5",
    "VIP 6",
    "VIP 7",
    "VIP 8",
    "VIP 9",
    "VIP 10",
    "VIP 11",
  ];

  // Utility function to capitalize the first letter of a string
  const capitalize = (str: string): string =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  // Capitalize each part of the full name
  const fullName = `${capitalize(firstName)} ${capitalize(
    middleName || "",
  )} ${capitalize(lastName)}`
    .replace(/\s+/g, " ")
    .trim();

  // Function to draw circular/oval image
  const drawCircularImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => {
    ctx.save();
    ctx.beginPath();
    // Create oval shape
    ctx.ellipse(x, y, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Draw image inside the clip
    ctx.drawImage(img, x - width / 2, y - height / 2, width, height);
    ctx.restore();

    // Add oval border
    ctx.save();
    ctx.strokeStyle = "#FFD700"; // Gold color border
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y, width / 2, height / 2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  // Function to wrap text
  // Function to wrap text
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
  ): string[] => {
    if (!text || text.trim() === "") return [];

    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine + " " + word;
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth < maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  useEffect(() => {
    
    if (!certificate || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = certificate;

    bgImg.onload = () => {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;

      // Draw background image
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      // Get current certificate template
      const currentCert = Object.values(certificates).find(
        (cert) => cert.img === certificate,
      );

      if (currentCert) {
        // Draw user image in oval shape if available
        if (userImage) {
          const userImg = new Image();
          userImg.crossOrigin = "anonymous";
          userImg.src = userImage;

          userImg.onload = () => {
            // Draw the user image in oval shape
            drawCircularImage(
              ctx,
              userImg,
              currentCert.imageX || CANVAS_WIDTH / 2,
              currentCert.imageY || 790,
              currentCert.imageWidth || 420,
              currentCert.imageHeight || 420,
            );

            // Continue drawing other elements after image is loaded
            drawTextElements(ctx, currentCert);
          };
        } else {
          // If no user image, just draw text elements
          drawTextElements(ctx, currentCert);
        }
      }
    };
  }, [
    certificate,
    userImage,
    fullName,
    fullNameInput,
    courseName,
    credits,
    trainingStart,
    trainingEnd,
    vip,
    certificateText,
  ]);

  const drawTextElements = (
    ctx: CanvasRenderingContext2D,
    currentCert: Certificate,
  ) => {
    // Set font styles
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Draw Full Name (below congratulations)
    ctx.font = "bold 72px 'Cormorant Garamond', serif";
    // ctx.fillStyle = "#8B4513"; // Brown color for elegance
    ctx.fillStyle = "#D3A55C"; // Brown color for elegance
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(139, 69, 19, 0.3)";
    ctx.fillText(
      fullNameInput || fullName,
      currentCert.nameX,
      currentCert.nameY,
    );

    // Reset shadow for other text
    ctx.shadowColor = "transparent";

    // Draw Certificate Text (under the name) with wrapping
    if (certificateText) {
      ctx.font = "48px 'Cormorant Garamond', serif";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";

      // Wrap certificate text if too long
      const certLines = wrapText(ctx, certificateText, 1200);
      certLines.forEach((line, index) => {
        const yOffset = index * 70;
        ctx.fillText(
          line,
          currentCert.nameX,
          currentCert.nameY + 120 + yOffset,
        );
      });
    }

    // Draw VIP selection
    if (vip) {
      ctx.font = "bold 100px 'Cormorant Garamond', serif";
      ctx.fillStyle = "#FFD700"; // Gold color for VIP
      ctx.textAlign = "right";
      ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
      ctx.shadowBlur = 6;
      // background color for VIP text
      ctx.fillStyle = "rgba(255, 215, 0, 0.8)";
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
      ctx.fillText(vip, currentCert.vipX || 1350, currentCert.vipY || 420);
    }
  };

  // Download the certificate
  const downloadCertificate = () => {
    if (!certificate || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = certificate;

    bgImg.onload = () => {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;

      // Draw background image
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      const currentCert = Object.values(certificates).find(
        (cert) => cert.img === certificate,
      );

      if (currentCert) {
        // Draw user image in oval shape if available
        if (userImage) {
          const userImg = new Image();
          userImg.crossOrigin = "anonymous";
          userImg.src = userImage;

          userImg.onload = () => {
            drawCircularImage(
              ctx,
              userImg,
              currentCert.imageX || CANVAS_WIDTH / 2,
              currentCert.imageY || 790,
              currentCert.imageWidth || 420,
              currentCert.imageHeight || 420,
            );

            // Draw all text elements
            drawTextElements(ctx, currentCert);

            // Download after everything is drawn
            downloadCanvas(canvas, fullNameInput || fullName);
          };
        } else {
          drawTextElements(ctx, currentCert);
          downloadCanvas(canvas, fullNameInput || fullName);
        }
      }
    };
  };

  const downloadCanvas = (canvas: HTMLCanvasElement, fileName: string) => {
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `${fileName.replace(/\s+/g, "_")}_certificate.png`;
    link.click();
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = "#F16425";
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = "#00A89E";
  };

  return (
    <div className="p-2 font-cormorant">
      <div className="">
        <div className="text-left">
          <p className="mb-1 text-lg">Select a certificate image</p>
          <select
            onChange={(e) =>
              setCertificate(certificates[e.target.value]?.img || null)
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            value={
              Object.keys(certificates).find(
                (key) => certificates[key].img === certificate,
              ) || ""
            }
          >
            <option className="text-black" value="">
              -- Select Certificate --
            </option>
            <option className="text-black" value="crt1">
              Certificate 1
            </option>
            {/* <option className="text-black" value="crt2">
              Certificate 2
            </option> */}
          </select>

          {/* User name input */}
          <div className="">
            <p className="mb-1 text-lg">Enter name</p>
            <input
              type="text"
              placeholder="Enter name (overrides form data)"
              value={fullNameInput}
              onChange={(e) => setFullNameInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {fullName && !fullNameInput && (
              <small className="text-gray-600 block mt-1">
                Using form data: {fullName}
              </small>
            )}
          </div>

          {/* Certificate text input */}
          <div className="mt-3">
            <p className="mb-1 text-lg">Enter certificate text</p>
            <input
              type="text"
              placeholder="Enter certificate text (e.g., 'For Outstanding Performance')"
              value={certificateText}
              onChange={(e) => setCertificateText(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* VIP selection */}
          <div className="mt-3">
            <p className="mb-1 text-lg">Select VIP level (optional)</p>
            <select
              onChange={(e) => setVip(e.target.value)}
              value={vip}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">-- Select VIP Level --</option>
              {vipList.map((vip, index) => (
                <option className="text-black" key={index} value={vip}>
                  {vip}
                </option>
              ))}
            </select>
          </div>

          {/* User image upload */}
          <div className="mt-3">
            <p className="mb-1 text-lg">Upload your image</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) =>
                    setUserImage(event.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }}
              className=" w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        // style={{
        //   border: "2px solid #ccc",
        //   borderRadius: "8px",
        //   maxWidth: "100%",
        //   height: "auto",
        //   margin: "20px auto",
        //   display: "block",
        //   boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        // }}
        className="border-2 border-gray-300 rounded-xs max-w-full h-auto mt-5 mx-auto block shadow-lg"
      ></canvas>

      <div className="flex items-center justify-center mt-4">
        <button
          className="bg-gray-700 border-none rounded-lg p-2 text-white font-bold py-3 px-6 transition-colors duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 "
          onClick={downloadCertificate}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Download Certificate
        </button>
      </div>
    </div>
  );
};;

export default GenerateCertificate;
