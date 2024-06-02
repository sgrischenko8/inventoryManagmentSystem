import{r as _,j as e,h as R,u as S,l as N,t as A,n as D,L as I}from"./index-e7c6efce.js";import{I as T,g as E}from"./getTotalCost-3a0eca4f.js";import{M,D as W}from"./Modal-51953c50.js";const $="_orderWrapper_1pqqe_1",G="_dateRangeForm_1pqqe_43",H="_orderList_1pqqe_90",Q="_order_1pqqe_1",U="_productListinOrder_1pqqe_152",X="_noResults_1pqqe_184",i={orderWrapper:$,dateRangeForm:G,orderList:H,order:Q,productListinOrder:U,noResults:X},z=({increment:f,product:s,orderId:c,deleteProductFromOrder:j,isOrderPaid:l})=>{const[u,x]=_.useState(s.amount),[m,n]=_.useState("");return e.jsxs(e.Fragment,{children:[!l&&e.jsx(T,{increment:f,quantity:u,limit:s.quantity,orderId:c,productId:s._id,setAmount:x}),e.jsx("h4",{children:s.name}),e.jsx("p",{children:"   -   "}),e.jsxs("p",{children:[s.amount," piece(s)"]}),!l&&e.jsx("button",{type:"button",onClick:()=>n(s._id),title:"Delete the Product from the Order",children:"X"}),m&&e.jsxs(M,{onClose:()=>n(""),children:[e.jsx(e.Fragment,{}),e.jsx(W,{subject:"product from the order",onSubmit:h=>{n(""),j(h,c,s._id)},onClose:()=>n("")})]})]})},V=()=>{const f=R(),[s,c]=S(),j=s.get("query"),l=_.useMemo(()=>Object.fromEntries([...s]),[s]),{data:u,isLoading:x,refetch:m}=N(l),n=u?.orders,h=u?.lowStock,g=u?.totalIncome,[L,{isLoading:P}]=A(),[y,{isLoading:C}]=D();async function k(t){try{await y({id:t,body:{paid:!0}}).unwrap(),m()}catch(r){console.log(r)}}async function b(t){try{await L(t).unwrap(),m()}catch(r){console.log(r)}}async function O(t,r){try{const a={id:r,body:{totalCost:E(t),products:t}};await y(a).unwrap(),m()}catch(a){console.log(a)}}function v(t,r,a){const d=[...n.find(o=>o._id===r).products].map(o=>{if(o._id===a){const q={...o};return q.amount=t,q}return o});O(d,r)}function F(t,r,a){t.preventDefault();const p=[...n.find(o=>o._id===r).products];if(p.length===1){b(r);return}const d=p.filter(o=>o._id!==a);O(d,r)}function w(t){t.preventDefault();let r={...l};const p=t.target.elements;Array.from(p).forEach(d=>{d.nodeName==="INPUT"&&d.value&&(r[d.name]=d.value)}),c(r)}return e.jsxs("div",{className:i.orderWrapper,children:[x||C||P&&e.jsx(I,{}),e.jsxs("div",{children:[e.jsxs("form",{onSubmit:w,id:"dateform",className:i.dateRangeForm,children:[e.jsxs("fieldset",{children:[e.jsx("legend",{children:"Date Range"}),e.jsxs("div",{children:[e.jsxs("label",{children:["From",e.jsx("input",{type:"date",name:"from"})]}),e.jsxs("label",{children:["To",e.jsx("input",{type:"date",name:"to"})]})]})]}),e.jsx("button",{type:"reset",form:"dateform",onClick:()=>c(j?{query:j}:{}),children:"Clear"}),e.jsx("button",{type:"submit",onClick:()=>!1,children:"Search"})]}),g&&e.jsx(e.Fragment,{children:e.jsxs("p",{children:["Total Income:",e.jsxs("b",{children:[g," $"]})]})}),h&&h.length>0&&e.jsxs(e.Fragment,{children:[e.jsx("b",{children:" Attention!"}),e.jsx("h2",{children:"Low stock:"}),e.jsx("ul",{children:h.map(t=>e.jsxs("li",{children:[e.jsxs("p",{children:[t.name,":"]})," ",e.jsx("p",{children:t.quantity})]},t._id))})]})]}),n?.length>0&&!x?e.jsx("ul",{className:i.orderList,children:n.map(t=>e.jsxs("li",{className:i.order,children:[!t.paid&&e.jsxs("div",{children:[e.jsx("button",{type:"button",onClick:()=>b(t._id),children:"Cancel order"}),e.jsx("button",{type:"button",onClick:()=>k(t._id),children:"Pay order"})]}),e.jsxs("p",{children:["number: ",t.number]}),e.jsxs("p",{children:["Placed: ",t.customer?.name]}),e.jsxs("p",{children:["created at: ",t.date.toString().slice(0,19).replace("T",", ")]}),e.jsx("ul",{className:i.productListinOrder,children:t.products.map(r=>e.jsx("li",{children:e.jsx(z,{increment:v,orderId:t._id,product:r,deleteProductFromOrder:F,isOrderPaid:t.paid})},r?._id))}),e.jsxs("p",{children:["Total: ",e.jsxs("b",{children:[t.totalCost||0," $"]})]})]},t._id))}):e.jsxs("div",{className:i.noResults,children:[e.jsx("h2",{children:"There are no orders"}),e.jsx("button",{type:"button",onClick:()=>f(-1),children:"Go back"})]})]})};export{V as default};