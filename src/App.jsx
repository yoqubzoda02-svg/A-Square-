import { useState, useEffect, useCallback } from "react";
import { saveData, loadData } from './firebase.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const P = "#7C5CBF", PL = "#A78BDB", D = "#0a0a0a", D2 = "#111", D3 = "#1a1a1a", D4 = "#222", T = "#F5F5F0", T2 = "#999";

const s = {
  app: { background: D, minHeight: "100vh", maxWidth: 430, margin: "0 auto", fontFamily: "'DM Sans', sans-serif", color: T, paddingBottom: 80 },
  hdr: { background: D2, borderBottom: `1px solid ${D4}`, padding: "14px 16px", position: "sticky", top: 0, zIndex: 100 },
  logo: { fontSize: 26, fontWeight: 700, color: PL, fontFamily: "Georgia, serif" },
  sub: { fontSize: 10, color: T2, letterSpacing: 2, marginTop: 1 },
  nav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: D2, borderTop: `1px solid ${D4}`, display: "flex", zIndex: 200, overflowX: "auto" },
  nb: (a) => ({ flex: "0 0 auto", padding: "10px 12px 8px", background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: a ? PL : T2 }),
  pg: { padding: "14px 14px 8px" },
  card: { background: D3, border: `1px solid ${D4}`, borderRadius: 12, padding: 14, marginBottom: 10 },
  cardP: { background: "#1a1228", border: `1px solid ${P}44`, borderRadius: 12, padding: 14, marginBottom: 10 },
  row: { display: "flex", gap: 8, marginBottom: 10 },
  met: { flex: 1, background: D3, border: `1px solid ${D4}`, borderRadius: 10, padding: "12px 8px", textAlign: "center" },
  mv: { fontSize: 18, fontWeight: 700, color: PL },
  ml: { fontSize: 9, color: T2, letterSpacing: 1, marginTop: 3, textTransform: "uppercase" },
  sec: { fontSize: 10, color: T2, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 },
  btn: { background: `linear-gradient(135deg, ${P}, ${PL})`, color: "#fff", border: "none", borderRadius: 10, padding: "12px 16px", fontWeight: 700, cursor: "pointer", fontSize: 14, width: "100%", marginTop: 8 },
  btnS: { background: D4, color: T, border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 600, cursor: "pointer", fontSize: 12 },
  btnD: { background: "#2a0a0a", color: "#ff6b6b", border: "1px solid #ff6b6b33", borderRadius: 8, padding: "7px 12px", fontWeight: 600, cursor: "pointer", fontSize: 12 },
  inp: { background: D4, border: `1px solid #333`, borderRadius: 10, padding: "11px 13px", color: T, fontSize: 14, width: "100%", outline: "none", boxSizing: "border-box" },
  lbl: { fontSize: 11, color: T2, marginBottom: 5, display: "block" },
  item: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${D4}` },
  badge: (c) => ({ display: "inline-block", background: `${c}22`, color: c, borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 600 }),
  ta: { background: D4, border: `1px solid #333`, borderRadius: 10, padding: "11px 13px", color: T, fontSize: 13, width: "100%", outline: "none", resize: "vertical", minHeight: 80, fontFamily: "inherit", boxSizing: "border-box" },
};

const STATUS_COLORS = { "Новый": "#4caf50", "Оплачен": "#2196f3", "Отправлен": "#ff9800", "Доставлен": "#9c27b0", "Возврат": "#f44336" };
const STATUSES = Object.keys(STATUS_COLORS);

const TABS = [
  { id: "home", icon: "🏠", label: "Главная" },
  { id: "orders", icon: "🛒", label: "Заказы" },
  { id: "stock", icon: "📦", label: "Склад" },
  { id: "expenses", icon: "💸", label: "Расходы" },
  { id: "split", icon: "🤝", label: "Раздел" },
  { id: "notes", icon: "📝", label: "Заметки" },
];

const DEFAULT = {
  stock: 8, totalStock: 8, category: "Детская обувь",
  orders: [],
  expenses: [],
  investments: { amir: 1196, anna: 1196 },
  investHistory: [
    { id: 1, person: "amir", amount: 1196, date: "20.06.2026", note: "Первый вклад" },
    { id: 2, person: "anna", amount: 1196, date: "20.06.2026", note: "Первый вклад" }
  ],
  notes: [],
  products: [],
};

export default function App() {
  const [tab, setTab] = useState("home");
  const [data, setData] = useState(DEFAULT);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData().then(d => {
      if (d) setData({ ...DEFAULT, ...d });
      setLoaded(true);
    });
  }, []);

  const save = useCallback(async (nd) => {
    setData(nd);
    setSaving(true);
    await saveData(nd);
    setTimeout(() => setSaving(false), 1000);
  }, []);

  if (!loaded) return <div style={{ ...s.app, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 12 }}><div style={{ color: PL, fontSize: 40, fontFamily: "Georgia, serif" }}>А²</div><div style={{ color: T2, fontSize: 12 }}>Загрузка...</div></div>;

  const soldOrders = data.orders.filter(o => o.status !== "Возврат");
  const returnOrders = data.orders.filter(o => o.status === "Возврат");
  const totalRevenue = soldOrders.reduce((a, o) => a + o.price, 0);
  const totalOrderCost = soldOrders.reduce((a, o) => a + o.cost, 0);
  const totalExpenses = data.expenses.reduce((a, e) => a + e.amount, 0);
  const totalReturns = returnOrders.reduce((a, o) => a + o.price, 0);
  const totalProfit = totalRevenue - totalOrderCost - totalExpenses;

  return (
    <div style={s.app}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
      <div style={s.hdr}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={s.logo}>А²</div><div style={s.sub}>{data.category} · Авито</div></div>
          <div style={{ textAlign: "right" }}>
            {saving ? <div style={{ fontSize: 10, color: PL }}>💾 Сохраняю...</div> : <div style={{ fontSize: 10, color: "#4caf50" }}>✓ Синхронизировано</div>}
            <div style={{ fontSize: 10, color: T2, marginTop: 2 }}>Амир + Анна</div>
          </div>
        </div>
      </div>

      <div style={s.pg}>
        {tab === "home" && <Home data={data} totalRevenue={totalRevenue} totalProfit={totalProfit} totalExpenses={totalExpenses} totalReturns={totalReturns} />}
        {tab === "orders" && <Orders data={data} save={save} />}
        {tab === "stock" && <Stock data={data} save={save} />}
        {tab === "expenses" && <Expenses data={data} save={save} totalExpenses={totalExpenses} />}
        {tab === "split" && <Split data={data} save={save} totalProfit={totalProfit} />}
        {tab === "notes" && <Notes data={data} save={save} />}
      </div>

      <div style={s.nav}>
        {TABS.map(t => (
          <button key={t.id} style={s.nb(tab === t.id)} onClick={() => setTab(t.id)}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span style={{ fontSize: 8, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Home({ data, totalRevenue, totalProfit, totalExpenses, totalReturns }) {
  const totalInv = data.investments.amir + data.investments.anna;
  const stockPct = (data.stock / Math.max(data.totalStock, 1)) * 100;
  const soldCount = data.orders.filter(o => o.status !== "Возврат").length;
  const returnCount = data.orders.filter(o => o.status === "Возврат").length;

  // Chart data - last 7 days
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6-i));
    const dateStr = d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
    const dayOrders = data.orders.filter(o => o.date === d.toLocaleDateString("ru-RU") && o.status !== "Возврат");
    return { date: dateStr.slice(0, 5), revenue: dayOrders.reduce((a, o) => a + o.price, 0), count: dayOrders.length };
  });

  return (
    <>
      <div style={s.sec}>Финансы А²</div>
      <div style={s.cardP}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div><div style={{ fontSize: 10, color: T2 }}>Выручка</div><div style={{ fontSize: 22, fontWeight: 700, color: PL }}>{totalRevenue} ₽</div></div>
          <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: T2 }}>Чистая прибыль</div><div style={{ fontSize: 22, fontWeight: 700, color: totalProfit >= 0 ? "#4caf50" : "#f44336" }}>{totalProfit.toFixed(0)} ₽</div></div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T2 }}>
          <span>Расходы: {totalExpenses} ₽</span>
          <span>Возвраты: {totalReturns} ₽</span>
          <span>Вложено: {totalInv} ₽</span>
        </div>
      </div>

      <div style={s.row}>
        <div style={s.met}><div style={s.mv}>{data.stock}</div><div style={s.ml}>На складе</div></div>
        <div style={s.met}><div style={s.mv}>{soldCount}</div><div style={s.ml}>Продано</div></div>
        <div style={s.met}><div style={{ ...s.mv, color: "#f44336" }}>{returnCount}</div><div style={s.ml}>Возвраты</div></div>
      </div>

      <div style={s.sec}>Продажи за 7 дней</div>
      <div style={s.card}>
        {last7.some(d => d.revenue > 0) ? (
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={last7} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <XAxis dataKey="date" tick={{ fill: T2, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: T2, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: D3, border: `1px solid ${D4}`, color: T, fontSize: 12 }} />
              <Bar dataKey="revenue" fill={P} radius={[4, 4, 0, 0]} name="Выручка ₽" />
            </BarChart>
          </ResponsiveContainer>
        ) : <div style={{ color: T2, fontSize: 12, textAlign: "center", padding: 20 }}>Нет данных</div>}
      </div>

      <div style={s.sec}>Остаток товара</div>
      <div style={s.card}>
        <div style={{ height: 8, background: D4, borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.min(stockPct,100)}%`, background: `linear-gradient(90deg, ${P}, ${PL})`, borderRadius: 4 }} />
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: T2, textAlign: "center" }}>{data.stock} из {data.totalStock} пар</div>
      </div>

      <div style={s.sec}>Статусы заказов</div>
      <div style={s.card}>
        {Object.entries(STATUS_COLORS).map(([st, color]) => {
          const cnt = data.orders.filter(o => o.status === st).length;
          return cnt > 0 ? (
            <div key={st} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${D4}` }}>
              <span style={s.badge(color)}>{st}</span>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{cnt} шт</span>
            </div>
          ) : null;
        })}
        {data.orders.length === 0 && <div style={{ color: T2, fontSize: 12, textAlign: "center", padding: 12 }}>Заказов нет</div>}
      </div>
    </>
  );
}

function Orders({ data, save }) {
  const [item, setItem] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [buyer, setBuyer] = useState("");
  const [filter, setFilter] = useState("Все");

  const addOrder = () => {
    const c = parseFloat(cost), p = parseFloat(price);
    if (!c || !p) return;
    const order = { id: Date.now(), item: item || "Товар", cost: c, price: p, buyer: buyer || "", status: "Новый", date: new Date().toLocaleDateString("ru-RU"), time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) };
    save({ ...data, orders: [order, ...data.orders], stock: Math.max(0, data.stock - 1) });
    setItem(""); setCost(""); setPrice(""); setBuyer("");
  };

  const changeStatus = (id, status) => {
    const orders = data.orders.map(o => o.id === id ? { ...o, status } : o);
    const order = data.orders.find(o => o.id === id);
    let stock = data.stock;
    if (status === "Возврат" && order.status !== "Возврат") stock++;
    if (status !== "Возврат" && order.status === "Возврат") stock--;
    save({ ...data, orders, stock: Math.max(0, stock) });
  };

  const deleteOrder = (id) => {
    const order = data.orders.find(o => o.id === id);
    save({ ...data, orders: data.orders.filter(o => o.id !== id), stock: order?.status !== "Возврат" ? data.stock + 1 : data.stock });
  };

  const filtered = filter === "Все" ? data.orders : data.orders.filter(o => o.status === filter);

  return (
    <>
      <div style={s.sec}>Новый заказ</div>
      <div style={s.cardP}>
        <label style={s.lbl}>Товар</label>
        <input style={s.inp} placeholder="Кроссовки детские бежевые" value={item} onChange={e => setItem(e.target.value)} />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <div style={{ flex: 1 }}><label style={s.lbl}>Себест. ₽</label><input style={s.inp} type="number" placeholder="349" value={cost} onChange={e => setCost(e.target.value)} /></div>
          <div style={{ flex: 1 }}><label style={s.lbl}>Продажа ₽</label><input style={s.inp} type="number" placeholder="650" value={price} onChange={e => setPrice(e.target.value)} /></div>
        </div>
        <label style={{ ...s.lbl, marginTop: 8 }}>Покупатель (необязательно)</label>
        <input style={s.inp} placeholder="Имя или ник Авито" value={buyer} onChange={e => setBuyer(e.target.value)} />
        {cost && price && (
          <div style={{ background: D, borderRadius: 8, padding: "8px 12px", marginTop: 8, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: T2 }}>Прибыль с продажи</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#4caf50" }}>{(parseFloat(price||0)-parseFloat(cost||0)).toFixed(0)} ₽</span>
          </div>
        )}
        <button style={s.btn} onClick={addOrder}>+ Добавить заказ</button>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 10, overflowX: "auto", paddingBottom: 4 }}>
        {["Все", ...STATUSES].map(st => (
          <button key={st} style={{ ...s.btnS, background: filter === st ? P : D4, color: filter === st ? "#fff" : T2, flexShrink: 0 }} onClick={() => setFilter(st)}>{st}</button>
        ))}
      </div>

      <div style={s.card}>
        {filtered.length === 0 && <div style={{ color: T2, fontSize: 12, textAlign: "center", padding: 16 }}>Нет заказов</div>}
        {filtered.map((o, i) => (
          <div key={o.id} style={{ paddingBottom: 10, marginBottom: 10, borderBottom: i === filtered.length-1 ? "none" : `1px solid ${D4}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{o.item}</div>
                {o.buyer && <div style={{ fontSize: 11, color: T2 }}>👤 {o.buyer}</div>}
                <div style={{ fontSize: 11, color: T2 }}>{o.date} {o.time}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: PL, fontWeight: 700, fontSize: 15 }}>{o.price} ₽</div>
                <div style={{ fontSize: 11, color: "#4caf50" }}>+{(o.price-o.cost).toFixed(0)} ₽</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {STATUSES.map(st => (
                <button key={st} style={{ ...s.btnS, fontSize: 10, padding: "4px 8px", background: o.status === st ? STATUS_COLORS[st] : D4, color: o.status === st ? "#fff" : T2, opacity: o.status === st ? 1 : 0.6 }} onClick={() => changeStatus(o.id, st)}>{st}</button>
              ))}
              <button style={{ ...s.btnD, fontSize: 10, padding: "4px 8px" }} onClick={() => deleteOrder(o.id)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Stock({ data, save }) {
  const [addAmt, setAddAmt] = useState("");
  const [cat, setCat] = useState(data.category);
  const [pName, setPName] = useState("");
  const [pBuy, setPBuy] = useState("");
  const [pSell, setPSell] = useState("");
  const [pArt, setPArt] = useState("");

  const addProduct = () => {
    if (!pName) return;
    const p = { id: Date.now(), name: pName, buyPrice: parseFloat(pBuy)||0, sellPrice: parseFloat(pSell)||0, sku: pArt || `ДО-${String(data.products.length+1).padStart(3,"0")}` };
    save({ ...data, products: [...data.products, p] });
    setPName(""); setPBuy(""); setPSell(""); setPArt("");
  };

  return (
    <>
      <div style={s.sec}>Склад</div>
      <div style={s.cardP}>
        <div style={{ fontSize: 52, fontWeight: 700, color: PL, textAlign: "center", fontFamily: "Georgia, serif" }}>{data.stock}</div>
        <div style={{ fontSize: 11, color: T2, textAlign: "center" }}>пар из {data.totalStock}</div>
      </div>

      <div style={s.sec}>Добавить партию</div>
      <div style={s.card}>
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ ...s.inp, flex: 1 }} type="number" placeholder="Кол-во пар" value={addAmt} onChange={e => setAddAmt(e.target.value)} />
          <button style={{ ...s.btn, width: "auto", padding: "11px 16px", marginTop: 0 }} onClick={() => { const a=parseInt(addAmt); if(a){save({...data,stock:data.stock+a,totalStock:data.totalStock+a});setAddAmt("");} }}>+ Добавить</button>
        </div>
      </div>

      <div style={s.sec}>Каталог товаров</div>
      <div style={s.card}>
        <label style={s.lbl}>Артикул</label>
        <input style={s.inp} placeholder="ДО-001" value={pArt} onChange={e => setPArt(e.target.value)} />
        <label style={{ ...s.lbl, marginTop: 8 }}>Название</label>
        <input style={s.inp} placeholder="Кроссовки детские бежевые" value={pName} onChange={e => setPName(e.target.value)} />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <div style={{ flex: 1 }}><label style={s.lbl}>Закупка ₽</label><input style={s.inp} type="number" value={pBuy} onChange={e => setPBuy(e.target.value)} /></div>
          <div style={{ flex: 1 }}><label style={s.lbl}>Авито ₽</label><input style={s.inp} type="number" value={pSell} onChange={e => setPSell(e.target.value)} /></div>
        </div>
        <button style={s.btn} onClick={addProduct}>+ Добавить товар</button>
      </div>

      {data.products.length > 0 && (
        <div style={s.card}>
          {data.products.map((p, i) => (
            <div key={p.id} style={{ ...s.item, borderBottom: i === data.products.length-1 ? "none" : `1px solid ${D4}` }}>
              <div>
                <div style={{ fontSize: 12, color: PL, fontWeight: 700 }}>{p.sku}</div>
                <div style={{ fontSize: 13 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: T2 }}>{p.buyPrice}₽ → {p.sellPrice}₽ · прибыль {p.sellPrice-p.buyPrice}₽</div>
              </div>
              <button style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16 }} onClick={() => save({ ...data, products: data.products.filter(x => x.id !== p.id) })}>✕</button>
            </div>
          ))}
        </div>
      )}

      <div style={s.sec}>Категория</div>
      <div style={s.card}>
        <input style={s.inp} value={cat} onChange={e => setCat(e.target.value)} placeholder="Детская обувь" />
        <button style={{ ...s.btnS, marginTop: 8, width: "100%" }} onClick={() => save({ ...data, category: cat })}>Сохранить</button>
      </div>
    </>
  );
}

function Expenses({ data, save, totalExpenses }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Упаковка");
  const TYPES = ["Упаковка", "Доставка Авито", "Комиссия Авито 5%", "Другое"];

  const add = () => {
    const a = parseFloat(amount);
    if (!a) return;
    const exp = { id: Date.now(), name: name || type, amount: a, type, date: new Date().toLocaleDateString("ru-RU") };
    save({ ...data, expenses: [exp, ...data.expenses] });
    setName(""); setAmount("");
  };

  const totalRevenue = data.orders.filter(o => o.status !== "Возврат").reduce((a,o)=>a+o.price,0);
  const avitoCommission = (totalRevenue * 0.05).toFixed(0);

  return (
    <>
      <div style={s.sec}>Добавить расход</div>
      <div style={s.cardP}>
        <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
          {TYPES.map(t => <button key={t} style={{ ...s.btnS, background: type === t ? P : D4, color: type === t ? "#fff" : T2, fontSize: 11, padding: "6px 10px" }} onClick={() => setType(t)}>{t}</button>)}
        </div>
        <label style={s.lbl}>Название (необязательно)</label>
        <input style={s.inp} placeholder={type} value={name} onChange={e => setName(e.target.value)} />
        <label style={{ ...s.lbl, marginTop: 8 }}>Сумма ₽</label>
        <input style={s.inp} type="number" placeholder="50" value={amount} onChange={e => setAmount(e.target.value)} />
        <button style={s.btn} onClick={add}>+ Добавить расход</button>
      </div>

      <div style={s.row}>
        <div style={s.met}><div style={{ ...s.mv, color: "#f44336" }}>{totalExpenses} ₽</div><div style={s.ml}>Все расходы</div></div>
        <div style={s.met}><div style={{ ...s.mv, color: "#ff9800", fontSize: 15 }}>{avitoCommission} ₽</div><div style={s.ml}>Авито 5% расчёт</div></div>
      </div>

      <div style={s.sec}>История расходов</div>
      <div style={s.card}>
        {data.expenses.length === 0 && <div style={{ color: T2, fontSize: 12, textAlign: "center", padding: 16 }}>Расходов нет</div>}
        {data.expenses.map((e, i) => (
          <div key={e.id} style={{ ...s.item, borderBottom: i === data.expenses.length-1 ? "none" : `1px solid ${D4}` }}>
            <div>
              <div style={{ fontSize: 13 }}>{e.name}</div>
              <div style={{ fontSize: 11, color: T2 }}>{e.date}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#f44336", fontWeight: 700 }}>−{e.amount} ₽</span>
              <button style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16 }} onClick={() => save({ ...data, expenses: data.expenses.filter(x => x.id !== e.id) })}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Split({ data, save, totalProfit }) {
  const [amirAdd, setAmirAdd] = useState("");
  const [annaAdd, setAnnaAdd] = useState("");
  const [amirNote, setAmirNote] = useState("");
  const [annaNote, setAnnaNote] = useState("");

  const addInv = (person, amount, note) => {
    const v = parseFloat(amount);
    if (!v) return;
    const entry = { id: Date.now(), person, amount: v, note: note || "", date: new Date().toLocaleDateString("ru-RU") };
    save({ ...data, investments: { ...data.investments, [person]: data.investments[person] + v }, investHistory: [entry, ...(data.investHistory||[])] });
    if (person === "amir") { setAmirAdd(""); setAmirNote(""); } else { setAnnaAdd(""); setAnnaNote(""); }
  };

  const totalInv = data.investments.amir + data.investments.anna;
  const half = (totalProfit / 2).toFixed(0);
  const amirPct = totalInv > 0 ? (data.investments.amir / totalInv * 100).toFixed(0) : 50;
  const annaPct = 100 - parseInt(amirPct);

  return (
    <>
      <div style={s.sec}>Раздел 50/50</div>
      <div style={s.cardP}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <div><div style={{ fontSize: 10, color: T2 }}>Амир получает</div><div style={{ fontSize: 24, fontWeight: 700, color: PL }}>{half} ₽</div></div>
          <div style={{ textAlign: "right" }}><div style={{ fontSize: 10, color: T2 }}>Анна получает</div><div style={{ fontSize: 24, fontWeight: 700, color: PL }}>{half} ₽</div></div>
        </div>
        <div style={{ fontSize: 11, color: T2, textAlign: "center" }}>Общая прибыль: {totalProfit.toFixed(0)} ₽</div>
      </div>

      <div style={s.sec}>Доли вложений</div>
      <div style={s.card}>
        <div style={{ display: "flex", height: 32, borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ width: `${amirPct}%`, background: P, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>{amirPct}%</div>
          <div style={{ width: `${annaPct}%`, background: PL, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: D }}>{annaPct}%</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: T2 }}>
          <span>Амир: {data.investments.amir} ₽</span>
          <span>Анна: {data.investments.anna} ₽</span>
        </div>
      </div>

      <div style={s.sec}>Добавить вложение</div>
      <div style={s.card}>
        <label style={s.lbl}>От Амира</label>
        <input style={s.inp} type="number" placeholder="₽" value={amirAdd} onChange={e => setAmirAdd(e.target.value)} />
        <input style={{ ...s.inp, marginTop: 6 }} placeholder="Заметка (откуда)" value={amirNote} onChange={e => setAmirNote(e.target.value)} />
        <button style={{ ...s.btnS, marginTop: 6, width: "100%" }} onClick={() => addInv("amir", amirAdd, amirNote)}>+ Добавить</button>
      </div>
      <div style={s.card}>
        <label style={s.lbl}>От Анны</label>
        <input style={s.inp} type="number" placeholder="₽" value={annaAdd} onChange={e => setAnnaAdd(e.target.value)} />
        <input style={{ ...s.inp, marginTop: 6 }} placeholder="Заметка (откуда)" value={annaNote} onChange={e => setAnnaNote(e.target.value)} />
        <button style={{ ...s.btnS, marginTop: 6, width: "100%" }} onClick={() => addInv("anna", annaAdd, annaNote)}>+ Добавить</button>
      </div>

      <div style={s.sec}>История вложений</div>
      <div style={s.card}>
        {(data.investHistory||[]).length === 0 && <div style={{ color: T2, fontSize: 12, textAlign: "center", padding: 12 }}>Нет истории</div>}
        {(data.investHistory||[]).map((h, i) => (
          <div key={h.id} style={{ ...s.item, borderBottom: i === (data.investHistory.length-1) ? "none" : `1px solid ${D4}` }}>
            <div>
              <div style={{ fontSize: 13 }}>{h.person === "amir" ? "👤 Амир" : "👤 Анна"} {h.note && `· ${h.note}`}</div>
              <div style={{ fontSize: 11, color: T2 }}>{h.date}</div>
            </div>
            <span style={{ color: "#4caf50", fontWeight: 700 }}>+{h.amount} ₽</span>
          </div>
        ))}
      </div>
    </>
  );
}

function Notes({ data, save }) {
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("amir");

  const addNote = () => {
    if (!text.trim()) return;
    const note = { id: Date.now(), text: text.trim(), author, date: new Date().toLocaleDateString("ru-RU"), time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) };
    save({ ...data, notes: [...(data.notes||[]), note] });
    setText("");
  };

  return (
    <>
      <div style={s.sec}>Заметки партнёров</div>
      <div style={s.card}>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <button style={{ ...s.btnS, flex: 1, background: author === "amir" ? P : D4, color: author === "amir" ? "#fff" : T2 }} onClick={() => setAuthor("amir")}>👤 Амир</button>
          <button style={{ ...s.btnS, flex: 1, background: author === "anna" ? P : D4, color: author === "anna" ? "#fff" : T2 }} onClick={() => setAuthor("anna")}>👤 Анна</button>
        </div>
        <textarea style={s.ta} placeholder="Напиши заметку партнёру..." value={text} onChange={e => setText(e.target.value)} />
        <button style={s.btn} onClick={addNote}>Отправить заметку</button>
      </div>

      <div style={s.card}>
        {(data.notes||[]).length === 0 && <div style={{ color: T2, fontSize: 12, textAlign: "center", padding: 16 }}>Заметок нет</div>}
        {[...(data.notes||[])].reverse().map((n, i) => (
          <div key={n.id} style={{ marginBottom: 12, padding: 10, background: n.author === "amir" ? `${P}22` : `${PL}22`, borderRadius: 10, borderLeft: `3px solid ${n.author === "amir" ? P : PL}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: n.author === "amir" ? PL : PL }}>{n.author === "amir" ? "👤 Амир" : "👤 Анна"}</span>
              <span style={{ fontSize: 10, color: T2 }}>{n.date} {n.time}</span>
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.5 }}>{n.text}</div>
            <button style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 11, marginTop: 4 }} onClick={() => save({ ...data, notes: data.notes.filter(x => x.id !== n.id) })}>✕ удалить</button>
          </div>
        ))}
      </div>
    </>
  );
}
