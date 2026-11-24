// ===== ຕັ້ງຄ່າຮ້ານ nnz · ແກ້ສະເພາະຂໍ້ຄວາມໃນເຄື່ອງໝາຍ " " =====
window.NNZ_CONFIG = {
  // ເບີ WhatsApp ຮັບອໍເດີ: ຕົວເລກລ້ວນ ມີລະຫັດປະເທດ 856 ນຳໜ້າ ບໍ່ມີ 0 ແລະ ບໍ່ມີຍະຫວ່າງ
  // ຕົວຢ່າງຮູບແບບ: "8562012345678"  (ປ່ອຍວ່າງ = ລູກຄ້າຈະເລືອກເອງວ່າສົ່ງຫາໃຜ)
  whatsapp: "8562054265554",

  // ເບີ WhatsApp ທີສອງ (ສະແດງໃນໜ້າຕິດຕໍ່)
  whatsapp2: "8562028954936",

  // ເບີທີ່ສະແດງໃຫ້ລູກຄ້າເຫັນ
  whatsappShow: "020 5426 5554",
  whatsappShow2: "020 2895 4936",

  // ຮູບ QR ຮັບເງິນ (OnePay) ແລະ ຊື່ບັນຊີທີ່ສະແດງໃນ QR · ປ່ອຍວ່າງ = ບໍ່ສະແດງ QR
  payQr: "images/pay-qr.jpg",
  payName: "ນ ໄພນາລິນ (NNZ ວິຕາມິນນຳເຂົ້າ)",

  address: "ບ້ານຫ້ວຍຫົງ ຮ່ອມ 22/9 ເມືອງຈັນທະບູລີ ນະຄອນຫຼວງວຽງຈັນ",

  // ສິນຄ້າຂາຍດີ ລຽງອັນດັບ 1 ລົງໄປ · ສິນຄ້າໝົດສະຕັອກຈະບໍ່ສະແດງໃນສ່ວນນີ້ເອງ · r1167 Swisse Grape Seed+ ເອົາອອກ 21/11 (ຂາດສະຕັອກ) (ໃສ່ id ຖັນ A ຂອງ Sheet) · ຂໍ້ມູນຈາກສະຖິຕິ Pancake 21/11/2026
  bestSellers: ["r1113","r633","r1479","r1334","r1435","r1218","r1477","r594","r1420","r1302"],

  // ແຖວທີ່ບໍ່ໃຫ້ສະແດງໃນແອັບ (id ຖັນ A) · r1478 Elevit ແບ່ງແຜງ ຍ້າຍໄປເປັນຕົວເລືອກແຍກແຜງໃນ r1479 ແລ້ວ
  hideIds: ["r1478","r541","r1126","r1508","r1474","r1298",
    "r150","r151","r153","r93","r187","r188","r1355","r355","r494","r281","r87","r527","r94","r488","r489","r1130","r1122","r1109","r229","r1495"], // ແຖວແບ່ງເກົ່າ ລວມເຂົ້າຂວດໃຫຍ່ແລ້ວ (r1495 Centrum Women B73→r1496, r1109 Youtheory B327→r277, r1130 Thompson Ginkgo B314→N314, r488 Neosporin S468→N468, r1355 KL Krill B162→N162, Elevit x2, Menevit, Tums, Carusos K2+D3, NTBT HSN Extra) + ເລີກຂາຍ (NTBT Zinc 100 N695, Tums Assorted Fruit 170, Neosporin ຫຼອດໃຫຍ່ B468, Natrol Gummies 10mg 200, NTBT Mag Glycinate N764, Versace Shower Gel A143, Whizkids Omega-3 N766, ກ່ອງໃສ່ວິຕາມິນ NNZ box C5, Lacues Firming N626, Twinings 3, L'il Critters Immune C, Kronolife, TheVASE)

  // ລາຄາໂປຣມີກຳນົດວັນ: ຕອນນີ້ຕັ້ງຢູ່ໜ້າແອັດມິນ (ຖັນ promo_ ໃນ Sheet) · ບ່ອນນີ້ໃຊ້ສຳຮອງເທົ່ານັ້ນ
  timedPromos: [],

  // ຄ່າສົ່ງໄຣເດີ ທຸກບ່ອນໃນເມືອງ ນະຄອນຫຼວງວຽງຈັນ (ກີບ) · ຝາກຂົນສົ່ງ ລູກຄ້າຈ່າຍເອງປາຍທາງ
  riderFee: 20000,

  // ລິ້ງແຜນທີ່ Google Maps ຂອງໜ້າຮ້ານ
  mapUrl: "https://maps.app.goo.gl/jinvwqsavLcDU51bA",

  // ລິ້ງ Google Sheet ທີ່ "ເຜີຍແຜ່ເປັນ CSV" (ເບິ່ງຄູ່ມື ຂັ້ນ 3) · ປ່ອຍວ່າງ = ໃຊ້ໄຟລ໌ products.csv ໃນໂຟນເດີນີ້
  sheetCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTbmuHipwfnenuKapbiU2JdywWGnZ5_M7pRYDmJP13xl6Z7ISSon6NLpb_iFnE6Nwrc6jZ9DN1NWZ2g/pub?output=csv",

  // true = ສະແດງແຖບສີເຫຼືອງ "ແອັບຕົວຢ່າງ" · ປ່ຽນເປັນ false ເມື່ອສິນຄ້າ ລາຄາ ແລະ ເບີເປັນຂອງຈິງແລ້ວ
  sampleMode: false,

  // ໂຄດສ່ວນຫຼຸດ ລອງສັ່ງທາງແອັບ · ປ່ຽນຕົວເລກ ຫຼື ວັນໝົດເຂດໄດ້ · ປິດໂຄດ: ປ່ຽນ active ເປັນ false
  promo: {
    active: true,
    code: "NNZAPP",        // ໂຄດທີ່ລູກຄ້າພິມ (ບໍ່ສົນຕົວພິມໃຫຍ່-ນ້ອຍ)
    off: 20000,            // ຫຼຸດ (ກີບ)
    min: 300000,           // ຍອດສິນຄ້າຂັ້ນຕ່ຳ (ກີບ)
    until: "2026-12-31",   // ໃຊ້ໄດ້ຮອດວັນນີ້
    note: "1 ເບີໂທ ໃຊ້ໄດ້ 1 ຄັ້ງ"
  }
};
