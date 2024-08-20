"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[3468], {
    78947: function (e, t, r) {
        r.d(t, {
            O: function () {
                return ExternalIcon
            }, n: function () {
                return ExternalIconNew
            }
        });
        var n = r(85893);
        let ExternalIcon = e => {
            let {...t} = e;
            return (0, n.jsx)("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                strokeWidth: 1.5,
                stroke: "currentColor", ...t,
                children: (0, n.jsx)("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                })
            })
        }, ExternalIconNew = e => (0, n.jsxs)("svg", {
            width: "1em",
            height: "1em",
            viewBox: "0 0 20 20",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg", ...e,
            children: [(0, n.jsx)("path", {
                opacity: .4,
                fillRule: "evenodd",
                clipRule: "evenodd",
                d: "M1.668 6.667a2.5 2.5 0 012.5-2.5h5a.833.833 0 110 1.666h-5a.833.833 0 00-.833.834v9.166c0 .46.373.834.833.834h9.167c.46 0 .833-.373.833-.834v-5a.833.833 0 111.667 0v5a2.5 2.5 0 01-2.5 2.5H4.168a2.5 2.5 0 01-2.5-2.5V6.667z",
                fill: "currentColor"
            }), (0, n.jsx)("path", {
                fillRule: "evenodd",
                clipRule: "evenodd",
                d: "M18.34 7.5a.833.833 0 01-1.667 0V4.512L9.5 11.684a.833.833 0 11-1.179-1.178l7.172-7.173h-2.99a.833.833 0 110-1.666h5.002c.46 0 .833.373.833.833v5z",
                fill: "currentColor"
            })]
        })
    }, 85031: function (e, t, r) {
        r.d(t, {
            p: function () {
                return PlusIcon
            }, w: function () {
                return PlusIconNew
            }
        });
        var n = r(85893);
        let PlusIcon = e => (0, n.jsx)("svg", {
            fill: "none",
            viewBox: "0 0 24 24",
            stroke: "currentColor", ...e,
            children: (0, n.jsx)("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "M12 6v6m0 0v6m0-6h6m-6 0H6"
            })
        }), PlusIconNew = e => (0, n.jsx)("svg", {
            width: "1em",
            height: "1em",
            viewBox: "0 0 16 17",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg", ...e,
            children: (0, n.jsx)("path", {
                d: "M8 3.5v10m5-5H3",
                stroke: "currentColor",
                strokeWidth: 1.5,
                strokeLinecap: "round",
                strokeLinejoin: "round"
            })
        })
    }, 23468: function (e, t, r) {
        r.r(t);
        var n = r(85893), l = r(29620), s = r(94184), o = r.n(s), i = r(67518), c = r(5233), a = r(85031), d = r(75814),
            u = r(51709), m = r(78947), h = r(11163), x = r(5152), f = r.n(x);
        let p = f()(() => r.e(7928).then(r.bind(r, 37928)).then(e => e.AddToCart), {
            loadableGenerated: {webpack: () => [37928]},
            ssr: !1
        });
        t.default = e => {
            var t, r;
            let {product: s, className: x} = e, {t: f} = (0, c.$G)("common"), {query: v} = (0, h.useRouter)(), {
                name: b,
                image: g,
                quantity: w,
                min_price: j,
                max_price: N,
                product_type: k,
                is_external: y
            } = null != s ? s : {}, {
                price: P,
                basePrice: C,
                discount: I
            } = (0, i.ZP)({
                amount: s.sale_price ? s.sale_price : s.price,
                baseAmount: s.price
            }), {price: L} = (0, i.ZP)({amount: j}), {price: E} = (0, i.ZP)({amount: N}), {openModal: V} = (0, d.SO)();

            function handleProductQuickView() {
                return V("PRODUCT_DETAILS", s.slug)
            }

            return (0, n.jsxs)("article", {
                className: o()("product-card cart-type-xenon h-full transform overflow-hidden rounded border border-border-200 border-opacity-70 bg-light transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:shadow", x),
                children: [(0, n.jsxs)("div", {
                    className: o()("relative flex h-48 w-auto cursor-pointer items-center justify-center sm:h-64", (null == v ? void 0 : v.pages) && (null == v ? void 0 : null === (t = v.pages) || void 0 === t ? void 0 : t.includes("medicine")) ? "m-4 mb-0" : ""),
                    onClick: handleProductQuickView,
                    children: [(0, n.jsx)("span", {
                        className: "sr-only",
                        children: f("text-product-image")
                    }), (0, n.jsx)(l.E, {
                        src: null !== (r = null == g ? void 0 : g.original) && void 0 !== r ? r : u.Hb,
                        alt: b,
                        fill: !0,
                        sizes: "(max-width: 768px) 100vw",
                        className: "product-image object-contain"
                    }), I && (0, n.jsx)("div", {
                        className: "absolute top-3 rounded bg-accent px-1.5 text-xs font-semibold leading-6 text-light ltr:left-3 rtl:right-3 md:top-4 md:px-2 ltr:md:left-4 rtl:md:right-4 lg:px-2.5",
                        children: I
                    })]
                }), (0, n.jsxs)("header", {
                    className: "p-3 md:p-6",
                    children: [(0, n.jsx)("h3", {
                        className: "cursor-pointer truncate text-xs text-body md:text-sm",
                        onClick: handleProductQuickView,
                        children: b
                    }), (0, n.jsxs)("div", {
                        className: "mt-2 flex items-center justify-between",
                        children: ["variable" === k.toLowerCase() || y ? (0, n.jsxs)(n.Fragment, {
                            children: [(0, n.jsxs)("div", {
                                children: [(0, n.jsx)("span", {
                                    className: "text-sm font-semibold text-heading md:text-base",
                                    children: L
                                }), (0, n.jsx)("span", {children: " - "}), (0, n.jsx)("span", {
                                    className: "text-sm font-semibold text-heading md:text-base",
                                    children: E
                                })]
                            }), Number(w) > 0 && (0, n.jsxs)("button", {
                                onClick: handleProductQuickView,
                                className: "flex h-7 w-7 items-center justify-center rounded border border-border-200 bg-light text-sm text-accent transition-colors hover:border-accent hover:bg-accent hover:text-light focus:border-accent focus:bg-accent focus:text-light focus:outline-0 md:h-9 md:w-9",
                                children: [(0, n.jsx)("span", {
                                    className: "sr-only",
                                    children: "plus"
                                }), y ? (0, n.jsx)(m.O, {className: "h-5 w-5 stroke-2"}) : (0, n.jsx)(a.p, {className: "h-5 w-5 stroke-2"})]
                            })]
                        }) : (0, n.jsxs)(n.Fragment, {
                            children: [(0, n.jsxs)("div", {
                                className: "flex flex-col md:flex-row md:items-center",
                                children: [(0, n.jsx)("span", {
                                    className: "text-sm font-semibold text-heading md:text-base",
                                    children: P
                                }), C && (0, n.jsx)("del", {
                                    className: "mt-1 text-xs text-muted md:mt-0 ltr:md:ml-2 rtl:md:mr-2",
                                    children: C
                                })]
                            }), Number(w) > 0 && (0, n.jsx)(p, {
                                variant: "argon",
                                data: s,
                                counterClass: "absolute sm:static bottom-3 ltr:right-3 rtl:left-3 sm:bottom-0 ltr:sm:right-0 rtl:sm:left-0"
                            })]
                        }), 0 >= Number(w) && (0, n.jsx)("div", {
                            className: "truncate rounded bg-red-500 px-1 py-1 text-xs text-light",
                            children: f("text-out-stock")
                        })]
                    })]
                })]
            })
        }
    }, 67518: function (e, t, r) {
        r.d(t, {
            ZP: function () {
                return usePrice
            }
        });
        var n = r(67294), l = r(11163), s = r(43516);

        function formatPrice(e) {
            let {amount: t, currencyCode: r, locale: n, fractions: l} = e,
                s = new Intl.NumberFormat(n, {style: "currency", currency: r, maximumFractionDigits: l});
            return s.format(t)
        }

        function usePrice(e) {
            let {settings: t} = (0, s.rV)(), r = null == t ? void 0 : t.currency,
                o = null == t ? void 0 : t.currencyOptions, {
                    amount: i,
                    baseAmount: c,
                    currencyCode: a,
                    currencyOptionsFormat: d
                } = {
                    ...e,
                    currencyCode: null != r ? r : "USD",
                    currencyOptionsFormat: null != o ? o : {formation: "en-US", fractions: 2}
                }, {formation: u = "en-US", fractions: m = 2} = d, {locale: h} = (0, l.useRouter)(),
                x = (0, n.useMemo)(() => {
                    if ("number" != typeof i || !a) return "";
                    let e = m || 2, t = u || "en";
                    return c ? function (e) {
                        let {amount: t, baseAmount: r, currencyCode: n, locale: l, fractions: s = 2} = e, o = r > t,
                            i = new Intl.NumberFormat(l, {style: "percent"}), c = o ? i.format((r - t) / r) : null,
                            a = formatPrice({amount: t, currencyCode: n, locale: l, fractions: s}),
                            d = o ? formatPrice({amount: r, currencyCode: n, locale: l, fractions: s}) : null;
                        return {price: a, basePrice: d, discount: c}
                    }({amount: i, baseAmount: c, currencyCode: a, locale: t, fractions: e}) : formatPrice({
                        amount: i,
                        currencyCode: a,
                        locale: t,
                        fractions: e
                    })
                }, [i, c, a, h]);
            return "string" == typeof x ? {price: x, basePrice: null, discount: null} : x
        }
    }
}]);