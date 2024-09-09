import {
	DropdownButton,
	FlyoutMenu,
	IconDownload24,
	MenuItem,
} from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import React, { useRef, useState } from "react";
import { useDownload } from "./hooks/download";
import { PDFArea } from "./components/PDFArea";
import { useReactToPrint } from "react-to-print";

export function Download() {
	const targetRef = useRef<HTMLDivElement | null>(null);

	const [downloadedData, setDownloadedData] = useState<
		Array<Record<string, any>> | undefined
	>();
	const [downloadStateRef, setDownloadStateRef] = useState(false);

	const { download, downloading, getDownloadData, filename } = useDownload();

	const handlePrint = useReactToPrint({
		content: () => targetRef.current,
		documentTitle: filename,
	});

	const onDownloadClick =
		(type: "xlsx" | "csv" | "json" | "pdf") => async () => {
			setDownloadStateRef(false);
			if (type === "pdf") {
				const data = await getDownloadData();
				setDownloadedData(data ?? []);
				handlePrint();
				setTimeout(() => setDownloadedData(undefined), 1000);
			} else {
				await download(type);
			}
		};

	return (
		<>
			{downloadedData && (
				<PDFArea data={downloadedData} ref={targetRef} />
			)}
			<DropdownButton
				open={downloadStateRef}
				onClick={() => setDownloadStateRef((prevState) => !prevState)}
				component={
					<div className="w-100">
						<FlyoutMenu>
							<MenuItem
								label={i18n.t("Excel")}
								onClick={onDownloadClick("xlsx")}
							/>
							<MenuItem
								label={i18n.t("CSV")}
								onClick={onDownloadClick("csv")}
							/>
							<MenuItem
								label={i18n.t("JSON")}
								onClick={onDownloadClick("json")}
							/>
							<MenuItem
								label={i18n.t("PDF")}
								onClick={onDownloadClick("pdf")}
							/>
						</FlyoutMenu>
					</div>
				}
				disabled={downloading}
				icon={<IconDownload24 />}
			>
				{downloading ? i18n.t("Downloading...") : i18n.t("Download")}
			</DropdownButton>
		</>
	);
}
