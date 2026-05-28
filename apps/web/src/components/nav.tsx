import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { PillButton } from "@zias/ui/components/pill-button";
import { cn } from "@zias/ui/lib/utils";
import { Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Nav() {
	const { resolvedTheme, setTheme } = useTheme();
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		setMobileOpen(false);
	}, []);

	const handleSayHi = () => {
		if (pathname === "/") {
			document
				.getElementById("contact")
				?.scrollIntoView({ behavior: "smooth" });
		} else {
			navigate({ to: "/", hash: "contact" });
		}
	};

	const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();

		if (pathname === "/") {
			window.scrollTo({ top: 0, behavior: "smooth" });
			return;
		}

		navigate({ to: "/" });
		requestAnimationFrame(() => {
			window.scrollTo({ top: 0, behavior: "smooth" });
		});
	};

	const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
		const newTheme = resolvedTheme === "dark" ? "light" : "dark";
		const prefersReduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (!("startViewTransition" in document) || prefersReduced) {
			setTheme(newTheme);
			return;
		}

		const { clientX: x, clientY: y } = e;
		// biome-ignore lint/suspicious/noExplicitAny: View Transitions API not yet in TS DOM lib
		const vt = (document as any).startViewTransition(() => setTheme(newTheme));
		const maxRadius = Math.hypot(
			Math.max(x, window.innerWidth - x),
			Math.max(y, window.innerHeight - y),
		);

		vt.ready.then(() => {
			document.documentElement.animate(
				{
					clipPath: [
						`circle(0px at ${x}px ${y}px)`,
						`circle(${maxRadius}px at ${x}px ${y}px)`,
					],
				},
				{
					duration: 600,
					easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
					pseudoElement: "::view-transition-new(root)",
				},
			);
		});
	};

	return (
		<>
			<a href="#main-content" className="skip-to-content">
				Skip to content
			</a>
			<header className="fixed top-0 left-0 z-50 h-[72px] w-full pt-1.5">
				<div className="mx-auto w-full max-w-screen-2xl px-6 md:px-12 xl:px-24">
					<div
						className={cn(
							"rounded-[22px] border border-white/30",
							"bg-white/65 shadow-[0_12px_40px_rgba(20,20,40,0.12)] backdrop-blur-xl",
							"dark:border-white/15 dark:bg-black/40 dark:shadow-[0_12px_40px_rgba(0,0,0,0.45)]",
						)}
					>
						<div className="flex h-[64px] items-center justify-between px-4 md:px-6">
							{/* Logo */}
							<Link
								to="/"
								aria-label="zias.be — home"
								className="flex items-center"
								onClick={handleHomeClick}
							>
								<div className="flex size-[42px] items-center justify-center rounded-[8px] border-2 border-foreground/80 p-[2px] text-foreground">
									<LogoMark />
								</div>
							</Link>

							<nav
								aria-label="Main navigation"
								className="hidden items-center gap-6 md:flex"
							>
								<Link
									to="/journal"
									className="font-display font-semibold text-foreground/85 text-sm transition-colors hover:text-foreground"
								>
									My Journal
								</Link>

								<button
									type="button"
									aria-label={
										resolvedTheme === "dark"
											? "Switch to light mode"
											: "Switch to dark mode"
									}
									onClick={handleThemeToggle}
									className="flex size-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
								>
									<motion.span
										key={resolvedTheme}
										initial={{ rotate: -90, opacity: 0, scale: 0.4 }}
										animate={{ rotate: 0, opacity: 1, scale: 1 }}
										transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
										className="flex items-center justify-center"
									>
										{resolvedTheme === "dark" ? (
											<Sun size={16} strokeWidth={2.5} />
										) : (
											<Moon size={16} strokeWidth={2.5} />
										)}
									</motion.span>
								</button>

								<PillButton size="sm" onClick={handleSayHi}>
									Say Hi!
								</PillButton>
							</nav>

							<div className="flex items-center gap-2 md:hidden">
								<button
									type="button"
									aria-label={
										resolvedTheme === "dark"
											? "Switch to light mode"
											: "Switch to dark mode"
									}
									onClick={handleThemeToggle}
									className="flex size-9 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
								>
									{resolvedTheme === "dark" ? (
										<Sun size={16} strokeWidth={2.5} />
									) : (
										<Moon size={16} strokeWidth={2.5} />
									)}
								</button>
								<motion.button
									type="button"
									aria-label={mobileOpen ? "Close menu" : "Open menu"}
									onClick={() => setMobileOpen((prev) => !prev)}
									className="flex size-9 items-center justify-center rounded-full text-foreground/85 transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
									whileTap={{ scale: 0.92 }}
								>
									<AnimatePresence mode="wait" initial={false}>
										{mobileOpen ? (
											<motion.span
												key="close"
												initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
												animate={{ rotate: 0, opacity: 1, scale: 1 }}
												exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
												transition={{
													duration: 0.18,
													ease: [0.22, 1, 0.36, 1],
												}}
												className="flex items-center justify-center"
											>
												<X size={18} strokeWidth={2.5} />
											</motion.span>
										) : (
											<motion.span
												key="menu"
												initial={{ rotate: 90, opacity: 0, scale: 0.8 }}
												animate={{ rotate: 0, opacity: 1, scale: 1 }}
												exit={{ rotate: -90, opacity: 0, scale: 0.8 }}
												transition={{
													duration: 0.18,
													ease: [0.22, 1, 0.36, 1],
												}}
												className="flex items-center justify-center"
											>
												<Menu size={18} strokeWidth={2.5} />
											</motion.span>
										)}
									</AnimatePresence>
								</motion.button>
							</div>
						</div>

						<AnimatePresence initial={false}>
							{mobileOpen ? (
								<motion.nav
									key="mobile-menu"
									aria-label="Mobile navigation"
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
									className="overflow-hidden"
								>
									<div className="space-y-3 border-white/25 border-t px-4 pt-2 pb-4 dark:border-white/10">
										<motion.div
											initial={{ y: -8, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ duration: 0.18, delay: 0.06 }}
										>
											<Link
												to="/journal"
												className="block rounded-xl px-3 py-2 font-display font-semibold text-foreground/90 text-sm transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
											>
												My Journal
											</Link>
										</motion.div>
										<motion.div
											initial={{ y: -8, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ duration: 0.18, delay: 0.1 }}
										>
											<PillButton size="sm" onClick={handleSayHi}>
												Say Hi!
											</PillButton>
										</motion.div>
									</div>
								</motion.nav>
							) : null}
						</AnimatePresence>
					</div>
				</div>
			</header>
		</>
	);
}

function LogoMark() {
	return (
		<svg
			width="30"
			height="28.2"
			viewBox="0 0 30 28.2"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden
			role="presentation"
		>
			<g clipPath="url(#logo-clip)">
				<path
					d="M0.7368 -0.1401C0.6594 -0.5469 0.2667 -0.8142 -0.1401 -0.7368C-0.5469 -0.6594 -0.8142 -0.2667 -0.7368 0.1401L-6.85537e-08 -6.85537e-08L0.7368 -0.1401ZM0.4317 6.285C0.5091 6.6921 0.9018 6.9591 1.3086 6.8817C1.7157 6.8043 1.9827 6.4119 1.9053 6.0048L1.1685 6.1449L0.4317 6.285ZM7.6065 0.7086C7.203 0.6156 6.8004 0.8673 6.7074 1.2711C6.6141 1.6746 6.8658 2.0772 7.2696 2.1705L7.4382 1.4394L7.6065 0.7086ZM10.2441 6.1386L10.5252 6.834C10.5318 6.8313 10.5381 6.8286 10.5444 6.8259L10.2441 6.1386ZM4.9713 17.0442L4.2216 17.0598C4.2219 17.0739 4.2225 17.0877 4.2237 17.1018L4.9713 17.0442ZM30.7461 18.183C30.7878 17.7708 30.4872 17.4033 30.075 17.3619C29.6628 17.3202 29.2953 17.6208 29.2539 18.033L30 18.108L30.7461 18.183ZM11.6868 14.3421C11.7525 13.9332 11.4744 13.5483 11.0655 13.4826C10.6566 13.4169 10.2717 13.695 10.2057 14.1039L10.9464 14.223L11.6868 14.3421ZM10.0758 17.9352C10.0671 18.3492 10.3956 18.6921 10.8099 18.7005C11.2239 18.7092 11.5668 18.3807 11.5755 17.9664L10.8255 17.9508L10.0758 17.9352ZM15.4638 15.0342L15.2754 14.3082C15.1518 14.3403 15.0387 14.403 14.9463 14.4912L15.4638 15.0342ZM18.6765 18.4752L18.9126 19.1871C19.0527 19.1406 19.1757 19.0539 19.2669 18.9378L18.6765 18.4752ZM18.5559 15.4881L18.0006 15.9921L18.0015 15.9933L18.5559 15.4881ZM16.9374 14.6517L16.8927 13.9032C16.8441 13.9059 16.7961 13.9137 16.749 13.926L16.9374 14.6517ZM20.2173 15.1323C20.2716 14.7216 19.9824 14.3448 19.5717 14.2905C19.161 14.2365 18.7842 14.5254 18.7302 14.9361L19.4739 15.0342L20.2173 15.1323ZM18.513 19.3104C18.5472 19.7232 18.9096 20.0301 19.3224 19.9959C19.7352 19.962 20.0421 19.5996 20.0079 19.1868L19.2606 19.2486L18.513 19.3104ZM25.0515 15.6027C25.4133 15.8043 25.8702 15.6744 26.0715 15.3126C26.2731 14.9505 26.1432 14.4939 25.7814 14.2923L25.4163 14.9475L25.0515 15.6027ZM22.7349 16.0122L22.1562 15.5352C22.065 15.6459 22.0074 15.7803 21.9903 15.9225L22.7349 16.0122ZM24.2811 17.9985L24.9702 17.7024C24.8718 17.4738 24.6669 17.3088 24.4224 17.262L24.2811 17.9985ZM22.1769 19.2813C21.7764 19.176 21.3663 19.4154 21.2607 19.8159C21.1554 20.2164 21.3948 20.6268 21.7953 20.7321L21.9861 20.0067L22.1769 19.2813ZM-6.85537e-08 -6.85537e-08L-0.7368 0.1401L0.4317 6.285L1.1685 6.1449L1.9053 6.0048L0.7368 -0.1401L-6.85537e-08 -6.85537e-08ZM7.4382 1.4394L7.2696 2.1705C8.7381 2.5089 9.8604 2.8527 10.6584 3.195C11.4942 3.5541 11.8359 3.855 11.9355 4.0248C11.9673 4.0791 11.9589 4.0914 11.9586 4.0941C11.9544 4.1151 11.9286 4.1988 11.7933 4.3425C11.5104 4.6434 10.9269 5.022 9.9438 5.4513L10.2441 6.1386L10.5444 6.8259C11.5725 6.3768 12.3879 5.9001 12.8865 5.3697C13.1418 5.0979 13.3524 4.7718 13.4292 4.3893C13.5096 3.9879 13.4274 3.603 13.2291 3.2652C12.8688 2.6514 12.1269 2.193 11.25 1.8168C10.335 1.4241 9.1152 1.0566 7.6065 0.7086L7.4382 1.4394ZM10.2441 6.1386L9.963 5.4432C8.2329 6.1431 6.7326 7.2891 5.7 9.1854C4.6785 11.0616 4.149 13.6095 4.2216 17.0598L4.9713 17.0442L5.7213 17.0283C5.6517 13.7298 6.1641 11.4696 7.0173 9.9027C7.8594 8.3559 9.0669 7.4238 10.5252 6.834L10.2441 6.1386ZM4.9713 17.0442L4.2237 17.1018C4.5432 21.2451 6.2733 24.2676 8.7546 26.2251C11.2209 28.1706 14.3733 29.0208 17.4885 28.9455C23.6631 28.7958 30.0651 24.9522 30.7461 18.183L30 18.108L29.2539 18.033C28.6752 23.7834 23.1726 27.3072 17.4522 27.4458C14.6202 27.5145 11.8275 26.7387 9.6837 25.0473C7.5546 23.3679 6.009 20.7429 5.7192 16.9863L4.9713 17.0442ZM10.9464 14.223L10.2057 14.1039C10.1841 14.2383 10.1697 14.5722 10.1574 14.9058C10.1436 15.2736 10.1298 15.7332 10.1178 16.1808C10.1058 16.6293 10.0953 17.0676 10.0878 17.394C10.0839 17.5572 10.0809 17.6922 10.0788 17.7867C10.0779 17.8341 10.077 17.871 10.0764 17.8962C10.0761 17.9088 10.0761 17.9187 10.0758 17.925C10.0758 17.9283 10.0758 17.931 10.0758 17.9325C10.0758 17.9334 10.0758 17.934 10.0758 17.9343C10.0758 17.9346 10.0758 17.9352 10.0758 17.9352C10.0758 17.9355 10.0758 17.9352 10.8255 17.9508C11.5755 17.9664 11.5755 17.9664 11.5755 17.9664C11.5755 17.9664 11.5755 17.9661 11.5755 17.9658C11.5755 17.9655 11.5755 17.9649 11.5755 17.964C11.5755 17.9625 11.5755 17.9601 11.5755 17.9568C11.5758 17.9505 11.5758 17.9409 11.5761 17.9283C11.5767 17.9034 11.5776 17.8665 11.5785 17.8194C11.5806 17.7255 11.5836 17.5908 11.5872 17.4285C11.5947 17.1033 11.6052 16.6668 11.6172 16.2213C11.6292 15.7752 11.6427 15.3219 11.6562 14.9622C11.6631 14.7819 11.6697 14.628 11.676 14.5113C11.6832 14.3763 11.6883 14.3331 11.6868 14.3421L10.9464 14.223ZM15.4638 15.0342L14.9463 14.4912C14.2386 15.165 13.8522 15.9198 13.8492 16.6884C13.8465 17.4636 14.2347 18.108 14.7816 18.5397L15.2463 17.9508L15.7107 17.3619C15.4602 17.1642 15.3483 16.9302 15.3492 16.6941C15.3501 16.4517 15.4713 16.0626 15.981 15.5772L15.4638 15.0342ZM15.2463 17.9508L14.7816 18.5397C15.1923 18.8637 15.6789 19.284 16.3581 19.4574C17.0547 19.635 17.85 19.5393 18.9126 19.1871L18.6765 18.4752L18.4404 17.7633C17.4864 18.0795 17.0175 18.0777 16.7289 18.0039C16.4226 17.9259 16.2024 17.7498 15.7107 17.3619L15.2463 17.9508ZM18.6765 18.4752L19.2669 18.9378C19.806 18.2499 20.0676 17.5344 20.0001 16.8015C19.9341 16.0851 19.5648 15.4818 19.11 14.9829L18.5559 15.4881L18.0015 15.9933C18.3351 16.3596 18.4815 16.6689 18.5064 16.9392C18.5298 17.193 18.4578 17.5386 18.0864 18.0123L18.6765 18.4752ZM18.5559 15.4881L19.1112 14.9841C18.4887 14.2986 17.7456 13.8525 16.8927 13.9032L16.9374 14.6517L16.9818 15.4005C17.2056 15.3873 17.5413 15.4863 18.0006 15.9921L18.5559 15.4881ZM16.9374 14.6517L16.749 13.926L15.2754 14.3082L15.4638 15.0342L15.6519 15.7602L17.1255 15.3777L16.9374 14.6517ZM19.4739 15.0342C18.7302 14.9361 18.7302 14.9361 18.7302 14.9361C18.7302 14.9364 18.7302 14.9367 18.7302 14.937C18.7299 14.9373 18.7299 14.9379 18.7299 14.9388C18.7296 14.9403 18.7293 14.9424 18.729 14.9451C18.7284 14.9508 18.7272 14.9586 18.726 14.9691C18.7233 14.9898 18.7194 15.0198 18.7149 15.0582C18.7053 15.1353 18.6921 15.2466 18.6765 15.3846C18.6456 15.6606 18.6057 16.0455 18.5703 16.4817C18.4998 17.3415 18.4416 18.4473 18.513 19.3104L19.2606 19.2486L20.0079 19.1868C19.9473 18.4542 19.9959 17.4525 20.0652 16.6041C20.0994 16.1862 20.1375 15.8166 20.1672 15.5517C20.1822 15.4194 20.1948 15.3135 20.2035 15.2412C20.208 15.2052 20.2116 15.1773 20.214 15.1587C20.2152 15.1497 20.2161 15.1428 20.2167 15.1383C20.2167 15.1359 20.217 15.1344 20.2173 15.1332C20.2173 15.1329 20.2173 15.1326 20.2173 15.1323V15.132C20.2173 15.132 20.2173 15.1323 19.4739 15.0342ZM25.4163 14.9475L25.7814 14.2923C25.41 14.0856 25.0398 13.9434 24.6624 13.908C24.2676 13.8708 23.9127 13.9551 23.5941 14.127C23.2932 14.2893 23.0418 14.5206 22.824 14.7525C22.6071 14.9835 22.3821 15.261 22.1562 15.5352L22.7349 16.0122L23.3139 16.4892C23.5569 16.1943 23.7426 15.9654 23.9175 15.7794C24.0915 15.594 24.2133 15.4974 24.3063 15.4473C24.3816 15.4065 24.4413 15.3939 24.522 15.4014C24.6204 15.4107 24.7863 15.4551 25.0515 15.6027L25.4163 14.9475ZM22.7349 16.0122L21.9903 15.9225C21.9603 16.1727 21.9063 16.5069 21.8898 16.7418C21.8715 17.0007 21.8742 17.3514 22.0587 17.6898C22.2498 18.0405 22.5642 18.2511 22.896 18.3933C23.2209 18.5328 23.6364 18.6384 24.1395 18.735L24.2811 17.9985L24.4224 17.262C23.946 17.1702 23.6595 17.0889 23.4876 17.0151C23.3223 16.944 23.3445 16.9149 23.3754 16.9716C23.3997 17.016 23.3739 17.0184 23.3859 16.8471C23.3997 16.6518 23.4348 16.4739 23.4795 16.1019L22.7349 16.0122ZM24.2811 17.9985L23.592 18.2946C23.8032 18.7863 23.868 19.1052 23.868 19.2912C23.868 19.3773 23.8539 19.4136 23.8509 19.4199C23.8503 19.4217 23.8536 19.4172 23.8536 19.4172C23.8386 19.4283 23.7303 19.491 23.4123 19.4868C23.1078 19.4826 22.6977 19.4184 22.1769 19.2813L21.9861 20.0067L21.7953 20.7321C22.3758 20.8848 22.9173 20.9802 23.3925 20.9865C23.8542 20.9928 24.3534 20.916 24.7512 20.6187C25.1901 20.2911 25.3677 19.8027 25.368 19.2921C25.3683 18.8115 25.2162 18.2748 24.9702 17.7024L24.2811 17.9985Z"
					fill="currentColor"
				/>
			</g>
			<defs>
				<clipPath id="logo-clip">
					<rect width="30" height="28.2" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
}
