const PRD_API_URL = 'http://localhost:8080/api/products';
const PRD_CAT_API_URL = 'http://localhost:8080/api/categories';
const PRD_UPLOAD_BASE = 'http://localhost:8080';

const SUGGESTIONS = {
    CPU: ["Intel Core i3 12100F", "Intel Core i5 12400F", "Intel Core i5 13600K", "Intel Core i7 13700K", "AMD Ryzen 5 5600X", "AMD Ryzen 7 7800X3D"],
    RAM: ["8GB DDR4 3200MHz", "16GB DDR4 3200MHz", "16GB DDR5 5600MHz", "32GB DDR5 6000MHz", "64GB DDR5 6000MHz"],
    VGA: ["NVIDIA GTX 1660 Super", "NVIDIA RTX 3060 12GB", "NVIDIA RTX 4060 8GB", "NVIDIA RTX 4070 Ti", "AMD Radeon RX 6600"],
    SSD: ["256GB NVMe Gen3", "512GB NVMe Gen4", "1TB NVMe Gen4", "2TB NVMe Gen4", "512GB SATA III"],
    CASE: ["Xigmatek Gaming X", "DeepCool Macube", "NZXT H5 Flow", "Corsair 4000D Airflow", "Mik LV12"]
};

const BRANDS = ["ASUS", "MSI", "GIGABYTE", "ASROCK", "DELL", "HP", "LENOVO", "APPLE", "ACER", "LG", "SAMSUNG", "CUSTOM PC"];

let prdCurrentPage = 0;
let prdTotalPages = 0;

function getActor() {
    const userInfo = JSON.parse(localStorage.getItem('user_info'));
    return userInfo ? userInfo.username : 'SYSTEM';
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function renderDataLists() {
    const container = document.createElement('div');
    container.id = 'suggestion-datalists';
    container.innerHTML = `
        <datalist id="list-cpu">${SUGGESTIONS.CPU.map(v => `<option value="${v}">`).join('')}</datalist>
        <datalist id="list-ram">${SUGGESTIONS.RAM.map(v => `<option value="${v}">`).join('')}</datalist>
        <datalist id="list-vga">${SUGGESTIONS.VGA.map(v => `<option value="${v}">`).join('')}</datalist>
        <datalist id="list-ssd">${SUGGESTIONS.SSD.map(v => `<option value="${v}">`).join('')}</datalist>
        <datalist id="list-case">${SUGGESTIONS.CASE.map(v => `<option value="${v}">`).join('')}</datalist>
    `;
    document.body.appendChild(container);
}
if (!document.getElementById('suggestion-datalists')) renderDataLists();

async function loadProducts(page = 0) {
    prdCurrentPage = page;
    const mainView = document.getElementById('main-view');
    
    mainView.innerHTML = `
        <div class="p-8 bg-gray-50 min-h-screen font-sans">
            <div class="max-w-7xl mx-auto">
                <div class="flex justify-between items-end mb-6">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Sản phẩm</h2>
                        <p class="text-sm text-gray-500 mt-1">Quản lý danh sách và kho hàng</p>
                    </div>
                    <button onclick="renderAddProductForm()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg shadow-sm text-sm font-medium transition-all flex items-center gap-2">
                        <i class="fa-solid fa-plus"></i> <span>Tạo mới</span>
                    </button>
                </div>
                
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table class="w-full text-left border-collapse">
                        <thead class="bg-gray-50 text-gray-500 border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-4 text-xs font-semibold uppercase tracking-wider w-[40%]">Thông tin sản phẩm</th>
                                <th class="px-6 py-4 text-xs font-semibold uppercase tracking-wider">SKU / Hãng</th>
                                <th class="px-6 py-4 text-xs font-semibold uppercase tracking-wider">Phiên bản</th>
                                <th class="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-center">Tình trạng</th>
                                <th class="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-right">Tác vụ</th>
                            </tr>
                        </thead>
                        <tbody id="product-table-body" class="divide-y divide-gray-100 text-sm text-gray-700"></tbody>
                    </table>
                </div>

                <div class="flex justify-between items-center mt-6" id="pagination-controls">
                    <span class="text-sm text-gray-500">Trang <span class="font-bold text-gray-800">${prdCurrentPage + 1}</span> / <span id="total-pages-display">...</span></span>
                    <div class="flex gap-2">
                        <button onclick="loadProducts(prdCurrentPage - 1)" id="prev-btn" class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-600 shadow-sm transition-all">Trước</button>
                        <button onclick="loadProducts(prdCurrentPage + 1)" id="next-btn" class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-600 shadow-sm transition-all">Sau</button>
                    </div>
                </div>
            </div>
        </div>`;

    try {
        const res = await fetch(`${PRD_API_URL}?page=${page}&size=10`);
        const data = await res.json();
        const products = data.content;
        prdTotalPages = data.totalPages;

        document.getElementById('total-pages-display').innerText = prdTotalPages || 1;
        document.getElementById('prev-btn').disabled = prdCurrentPage === 0;
        document.getElementById('next-btn').disabled = prdCurrentPage >= prdTotalPages - 1;

        const tbody = document.getElementById('product-table-body');
        if (products.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center py-12 text-gray-400">Chưa có dữ liệu sản phẩm</td></tr>`;
            return;
        }

        tbody.innerHTML = products.map(p => `
            <tr class="hover:bg-indigo-50/30 transition-colors group">
                <td class="px-6 py-4">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-lg border border-gray-200 bg-white p-0.5 shrink-0 overflow-hidden relative">
                            <img src="${p.thumbnailUrl ? PRD_UPLOAD_BASE + p.thumbnailUrl : 'https://placehold.co/100'}" class="w-full h-full object-cover rounded-md">
                        </div>
                        <div>
                            <div class="font-bold text-gray-900 text-sm line-clamp-1 mb-1">${p.name}</div>
                            <div class="flex flex-wrap gap-1">
                                ${p.categories.map(c => `<span class="px-2 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-500 rounded-full border border-gray-200">${c.name}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="font-bold text-gray-700 text-xs uppercase tracking-wide">${p.brand || '---'}</div>
                    <div class="font-mono text-xs text-indigo-600 mt-1 font-medium bg-indigo-50 inline-block px-1.5 py-0.5 rounded">${p.sku}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-sm text-gray-600 font-medium">
                        ${p.variants ? p.variants.length : 0} <span class="text-xs text-gray-400 font-normal">cấu hình</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-center">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${p.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}">
                        ${p.status === 'active' ? 'Hoạt động' : 'Ngừng bán'}
                    </span>
                </td>
                <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onclick='renderViewProduct(${JSON.stringify(p).replace(/'/g, "&apos;")})' class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                            <i class="fa-regular fa-eye"></i>
                        </button>
                        <button onclick='renderEditProduct(${JSON.stringify(p).replace(/'/g, "&apos;")})' class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-full transition-colors">
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>
                        <button onclick="confirmDeleteProduct(${p.id})" class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

    } catch (err) {}
}

window.renderViewProduct = (p) => {
    const variantsHtml = p.variants && p.variants.length > 0 ? p.variants.map(v => {
        let cpu = '-', ram = '-', vga = '-', ssd = '-', pcase = '-';
        v.attributeValues.forEach(av => {
            if(av.attribute.code === 'CPU') cpu = av.value;
            if(av.attribute.code === 'RAM') ram = av.value;
            if(av.attribute.code === 'VGA') vga = av.value;
            if(av.attribute.code === 'SSD') ssd = av.value;
            if(av.attribute.code === 'CASE') pcase = av.value;
        });

        return `
            <tr class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 font-mono text-xs text-indigo-700 font-bold">${v.sku}</td>
                <td class="px-4 py-3 text-xs text-gray-700">
                    <div class="grid grid-cols-2 gap-x-2 gap-y-1">
                        <span><b class="text-gray-900">CPU:</b> ${cpu}</span>
                        <span><b class="text-gray-900">RAM:</b> ${ram}</span>
                        <span><b class="text-gray-900">VGA:</b> ${vga}</span>
                        <span><b class="text-gray-900">SSD:</b> ${ssd}</span>
                    </div>
                </td>
                <td class="px-4 py-3 text-center text-xs font-semibold text-gray-900">${v.quantity || 0}</td>
                <td class="px-4 py-3 text-right font-bold text-gray-900">${formatCurrency(v.price)}</td>
            </tr>
        `;
    }).join('') : `<tr><td colspan="4" class="px-4 py-6 text-center text-gray-400 text-xs italic">Không có cấu hình nào</td></tr>`;

    const imagesHtml = p.images && p.images.length > 0 
        ? p.images.map(img => `<div class="w-20 h-20 rounded border border-gray-200 overflow-hidden"><img src="${PRD_UPLOAD_BASE + img.imageUrl}" class="w-full h-full object-cover hover:scale-105 transition-transform"></div>`).join('') 
        : '<span class="text-xs text-gray-400 italic">Không có ảnh phụ</span>';

    Swal.fire({
        title: null,
        width: '900px',
        padding: 0,
        showConfirmButton: false,
        showCloseButton: true,
        customClass: { popup: 'rounded-xl overflow-hidden shadow-2xl' },
        html: `
            <div class="bg-white text-left font-sans">
                <div class="relative bg-gray-50 px-8 py-6 border-b border-gray-100 flex gap-6">
                    <div class="w-24 h-24 bg-white border border-gray-200 rounded-lg p-1 shrink-0 shadow-sm">
                        <img src="${p.thumbnailUrl ? PRD_UPLOAD_BASE + p.thumbnailUrl : 'https://placehold.co/150'}" class="w-full h-full object-cover rounded">
                    </div>
                    <div class="flex-1 pt-1">
                        <div class="flex items-center gap-3 mb-2">
                            <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${p.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-500 border-gray-200'}">
                                ${p.status === 'active' ? 'Kinh doanh' : 'Ngừng bán'}
                            </span>
                            <span class="text-xs font-bold text-indigo-600 uppercase tracking-wide">${p.brand || 'NO BRAND'}</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 leading-tight mb-2">${p.name}</h3>
                        <div class="font-mono text-xs text-gray-500 bg-gray-100 inline-block px-2 py-0.5 rounded">${p.sku}</div>
                    </div>
                </div>
                
                <div class="p-8 max-h-[65vh] overflow-y-auto space-y-8">
                    <div>
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Giới thiệu</h4>
                        <p class="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100">${p.description || 'Chưa cập nhật mô tả.'}</p>
                    </div>

                    <div>
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Thư viện ảnh</h4>
                        <div class="flex flex-wrap gap-3">${imagesHtml}</div>
                    </div>

                    <div>
                         <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Danh sách biến thể</h4>
                         <div class="border border-gray-100 rounded-lg overflow-hidden">
                            <table class="w-full text-left">
                                <thead class="bg-gray-50 text-[10px] uppercase text-gray-500 font-bold border-b border-gray-100">
                                    <tr>
                                        <th class="px-4 py-3">SKU</th>
                                        <th class="px-4 py-3">Thông số</th>
                                        <th class="px-4 py-3 text-center">Tồn</th>
                                        <th class="px-4 py-3 text-right">Giá niêm yết</th>
                                    </tr>
                                </thead>
                                <tbody>${variantsHtml}</tbody>
                            </table>
                         </div>
                    </div>
                </div>
            </div>
        `
    });
}

window.handleThumbPreview = (input) => {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('thumb-preview');
            preview.src = e.target.result;
            preview.classList.remove('hidden');
            document.getElementById('thumb-placeholder').classList.add('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
};

window.switchTab = (tabName) => {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
    
    document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('text-indigo-600', 'border-indigo-600', 'bg-indigo-50/50');
        el.classList.add('text-gray-500', 'border-transparent', 'hover:text-gray-700');
    });
    
    const activeBtn = document.getElementById(`btn-tab-${tabName}`);
    activeBtn.classList.remove('text-gray-500', 'border-transparent', 'hover:text-gray-700');
    activeBtn.classList.add('text-indigo-600', 'border-indigo-600', 'bg-indigo-50/50');
};

window.renderAddProductForm = async () => {
    const catRes = await fetch(PRD_CAT_API_URL);
    const categories = await catRes.json();
    const catTags = categories.map(c => `
        <label class="cursor-pointer select-none group">
            <input type="checkbox" name="cats" value="${c.id}" class="peer hidden">
            <span class="inline-block px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md transition-all peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 peer-checked:shadow-sm hover:border-gray-300">
                ${c.name}
            </span>
        </label>
    `).join('');

    const brandOptions = BRANDS.map(b => `<option value="${b}">${b}</option>`).join('');

    Swal.fire({
        title: null,
        width: '1000px',
        padding: 0,
        customClass: { popup: 'rounded-xl overflow-hidden' },
        html: getProductFormHtml('Thêm sản phẩm', 'submitProduct()', '', '', '', '', 'active', false, false, catTags, brandOptions, '', []),
        showConfirmButton: false,
        didOpen: () => {
            switchTab('info');
            addVariantRow();
        }
    });
};

window.renderEditProduct = async (p) => {
    const catRes = await fetch(PRD_CAT_API_URL);
    const categories = await catRes.json();
    const selectedCatIds = p.categories.map(c => c.id);
    
    const catTags = categories.map(c => `
        <label class="cursor-pointer select-none group">
            <input type="checkbox" name="cats" value="${c.id}" class="peer hidden" ${selectedCatIds.includes(c.id) ? 'checked' : ''}>
            <span class="inline-block px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-md transition-all peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 peer-checked:shadow-sm hover:border-gray-300">
                ${c.name}
            </span>
        </label>
    `).join('');

    const brandOptions = BRANDS.map(b => `<option value="${b}" ${p.brand === b ? 'selected' : ''}>${b}</option>`).join('');
    const currentThumb = p.thumbnailUrl ? PRD_UPLOAD_BASE + p.thumbnailUrl : '';
    
    const variantsHtml = p.variants.map(v => {
        let cpu = '', ram = '', vga = '', ssd = '', pcase = '';
        v.attributeValues.forEach(av => {
            if(av.attribute.code === 'CPU') cpu = av.value;
            if(av.attribute.code === 'RAM') ram = av.value;
            if(av.attribute.code === 'VGA') vga = av.value;
            if(av.attribute.code === 'SSD') ssd = av.value;
            if(av.attribute.code === 'CASE') pcase = av.value;
        });
        return createVariantRowHtml(Date.now() + Math.random(), v.sku, cpu, ram, vga, ssd, pcase, v.quantity, v.price);
    }).join('');

    Swal.fire({
        title: null,
        width: '1000px',
        padding: 0,
        customClass: { popup: 'rounded-xl overflow-hidden' },
        html: getProductFormHtml('Cập nhật', `submitUpdateProduct(${p.id})`, p.name, p.sku, p.brand, p.description, p.status, p.isNew, p.isBestSeller, catTags, brandOptions, currentThumb, variantsHtml),
        showConfirmButton: false,
        didOpen: () => {
            switchTab('info');
            if(p.thumbnailUrl) {
                document.getElementById('thumb-preview').classList.remove('hidden');
                document.getElementById('thumb-placeholder').classList.add('hidden');
            }
        }
    });
};

function getProductFormHtml(title, action, name, sku, brand, desc, status, isNew, isBest, catTags, brandOptions, thumbUrl, existingVariants) {
    return `
        <div class="flex flex-col h-[85vh] bg-gray-50 text-left font-sans">
            <div class="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
                <h3 class="text-lg font-bold text-gray-800">${title}</h3>
                <div class="flex gap-3">
                    <button onclick="Swal.close()" class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">Hủy bỏ</button>
                    <button onclick="${action}" class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-all">Lưu lại</button>
                </div>
            </div>

            <div class="flex bg-white px-6 border-b border-gray-200">
                <button id="btn-tab-info" onclick="switchTab('info')" class="tab-btn py-3 px-4 text-xs font-bold uppercase border-b-2 tracking-wide transition-colors focus:outline-none">Thông tin</button>
                <button id="btn-tab-images" onclick="switchTab('images')" class="tab-btn py-3 px-4 text-xs font-bold uppercase border-b-2 tracking-wide transition-colors focus:outline-none">Hình ảnh</button>
                <button id="btn-tab-variants" onclick="switchTab('variants')" class="tab-btn py-3 px-4 text-xs font-bold uppercase border-b-2 tracking-wide transition-colors focus:outline-none">Cấu hình & Kho</button>
            </div>

            <div class="flex-1 overflow-y-auto p-6 scroll-smooth">
                
                <div id="tab-info" class="tab-content space-y-5">
                    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div class="grid grid-cols-12 gap-6">
                            <div class="col-span-8">
                                <label class="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Tên sản phẩm</label>
                                <input id="inp-name" value="${name}" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm font-medium text-gray-800 placeholder-gray-400" placeholder="Nhập tên sản phẩm đầy đủ">
                            </div>
                            <div class="col-span-4">
                                <label class="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Mã SKU</label>
                                <input id="inp-sku" value="${sku}" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-mono text-sm text-indigo-700 font-bold" placeholder="AUTO-GEN">
                            </div>
                            
                            <div class="col-span-4">
                                <label class="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Thương hiệu</label>
                                <div class="relative">
                                    <select id="inp-brand" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white appearance-none outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm text-gray-700 cursor-pointer">
                                        ${brandOptions}
                                    </select>
                                    <i class="fa-solid fa-chevron-down absolute right-4 top-3 text-xs text-gray-400 pointer-events-none"></i>
                                </div>
                            </div>
                             <div class="col-span-4">
                                <label class="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Trạng thái</label>
                                <div class="relative">
                                    <select id="inp-status" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white appearance-none outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm text-gray-700 cursor-pointer">
                                        <option value="active" ${status === 'active' ? 'selected' : ''}>Kinh doanh</option>
                                        <option value="inactive" ${status === 'inactive' ? 'selected' : ''}>Ngừng bán</option>
                                    </select>
                                    <i class="fa-solid fa-chevron-down absolute right-4 top-3 text-xs text-gray-400 pointer-events-none"></i>
                                </div>
                            </div>
                             <div class="col-span-4">
                                <label class="block text-xs font-semibold text-gray-500 uppercase mb-2">Nhãn phụ</label>
                                <div class="flex gap-4">
                                    <label class="flex items-center gap-2 cursor-pointer select-none">
                                        <div class="relative flex items-center">
                                            <input type="checkbox" id="inp-new" class="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:border-indigo-600 checked:bg-indigo-600" ${isNew ? 'checked' : ''}>
                                            <i class="fa-solid fa-check absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-white opacity-0 peer-checked:opacity-100"></i>
                                        </div>
                                        <span class="text-sm text-gray-700">Mới</span>
                                    </label>
                                    <label class="flex items-center gap-2 cursor-pointer select-none">
                                        <div class="relative flex items-center">
                                            <input type="checkbox" id="inp-best" class="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:border-indigo-600 checked:bg-indigo-600" ${isBest ? 'checked' : ''}>
                                            <i class="fa-solid fa-check absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-white opacity-0 peer-checked:opacity-100"></i>
                                        </div>
                                        <span class="text-sm text-gray-700">Bán chạy</span>
                                    </label>
                                </div>
                            </div>

                            <div class="col-span-12">
                                <label class="block text-xs font-semibold text-gray-500 uppercase mb-2">Danh mục</label>
                                <div class="flex flex-wrap gap-2">${catTags}</div>
                            </div>
                            
                            <div class="col-span-12">
                                <label class="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Mô tả</label>
                                <textarea id="inp-desc" rows="5" class="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm text-gray-700 placeholder-gray-400 resize-none" placeholder="Nhập mô tả sản phẩm...">${desc || ''}</textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="tab-images" class="tab-content hidden space-y-5">
                    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div class="grid grid-cols-12 gap-8">
                            <div class="col-span-3">
                                <label class="block text-xs font-semibold text-gray-500 uppercase mb-2">Ảnh đại diện</label>
                                <div class="aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center relative cursor-pointer hover:bg-gray-100 hover:border-indigo-400 transition-all overflow-hidden group">
                                    <input type="file" id="inp-thumb" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" onchange="handleThumbPreview(this)">
                                    <img id="thumb-preview" src="${thumbUrl}" class="absolute inset-0 w-full h-full object-cover z-0 ${thumbUrl ? '' : 'hidden'}">
                                    <div id="thumb-placeholder" class="text-center ${thumbUrl ? 'hidden' : ''}">
                                        <i class="fa-solid fa-image text-2xl text-gray-400 mb-2 group-hover:text-indigo-500 transition-colors"></i>
                                        <span class="block text-[10px] font-bold text-gray-500 uppercase">Chọn ảnh</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-span-9">
                                <label class="block text-xs font-semibold text-gray-500 uppercase mb-2">Album ảnh</label>
                                <div class="h-full min-h-[150px] rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center relative cursor-pointer hover:bg-gray-100 hover:border-indigo-400 transition-all group">
                                    <input type="file" id="inp-gallery" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" multiple onchange="document.getElementById('gallery-text').innerHTML = '<span class=\'text-indigo-600 font-bold\'>' + this.files.length + ' ảnh đã chọn</span>'">
                                    <i class="fa-solid fa-cloud-arrow-up text-3xl text-gray-400 mb-3 group-hover:text-indigo-500 transition-colors"></i>
                                    <div class="text-xs font-medium text-gray-500" id="gallery-text">Kéo thả hoặc click để tải lên</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="tab-variants" class="tab-content hidden space-y-5">
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                            <h4 class="text-xs font-bold text-gray-600 uppercase">Danh sách cấu hình</h4>
                            <button onclick="addVariantRow()" class="text-xs bg-white hover:bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 border border-indigo-200 rounded-md transition-all shadow-sm">
                                <i class="fa-solid fa-plus mr-1"></i> Thêm dòng
                            </button>
                        </div>
                        
                        <div class="overflow-x-auto">
                            <table class="w-full text-left min-w-[800px]">
                                <thead class="bg-white text-[10px] font-bold text-gray-500 uppercase border-b border-gray-100">
                                    <tr>
                                        <th class="px-4 py-3 w-40">Mã SKU</th>
                                        <th class="px-4 py-3">Thông số (CPU / RAM / VGA / SSD / Case)</th>
                                        <th class="px-4 py-3 w-24 text-center">Tồn</th>
                                        <th class="px-4 py-3 w-36 text-right">Giá bán</th>
                                        <th class="px-2 py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody id="variant-list" class="divide-y divide-gray-50 bg-white">
                                    ${existingVariants || ''}
                                </tbody>
                            </table>
                            <div id="empty-msg" class="p-8 text-center text-gray-400 text-sm ${existingVariants ? 'hidden' : ''}">
                                <i class="fa-solid fa-box-open text-2xl mb-2 opacity-50"></i>
                                <p>Chưa có cấu hình nào</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
}

function createVariantRowHtml(rowId, sku, cpu, ram, vga, ssd, pcase, qty, price) {
    return `
    <tr id="v-row-${rowId}" class="group hover:bg-gray-50 transition-colors">
        <td class="p-3 align-top">
            <input type="text" value="${sku || ''}" class="v-sku w-full px-3 py-1.5 rounded bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none font-mono text-xs font-bold text-indigo-700 placeholder-gray-400" placeholder="SKU...">
        </td>
        <td class="p-3">
            <div class="grid grid-cols-12 gap-2">
                <div class="col-span-3"><input type="text" onchange="generateVariantSKU(${rowId})" value="${cpu || ''}" list="list-cpu" class="v-cpu w-full px-2 py-1.5 rounded border border-gray-200 text-xs focus:border-indigo-500 outline-none text-gray-700" placeholder="CPU"></div>
                <div class="col-span-3"><input type="text" onchange="generateVariantSKU(${rowId})" value="${ram || ''}" list="list-ram" class="v-ram w-full px-2 py-1.5 rounded border border-gray-200 text-xs focus:border-indigo-500 outline-none text-gray-700" placeholder="RAM"></div>
                <div class="col-span-3"><input type="text" onchange="generateVariantSKU(${rowId})" value="${vga || ''}" list="list-vga" class="v-vga w-full px-2 py-1.5 rounded border border-gray-200 text-xs focus:border-indigo-500 outline-none text-gray-700" placeholder="VGA"></div>
                <div class="col-span-3"><input type="text" value="${ssd || ''}" list="list-ssd" class="v-ssd w-full px-2 py-1.5 rounded border border-gray-200 text-xs focus:border-indigo-500 outline-none text-gray-700" placeholder="SSD"></div>
                <div class="col-span-12 mt-1"><input type="text" value="${pcase || ''}" list="list-case" class="v-case w-full px-2 py-1.5 rounded border border-gray-200 text-xs focus:border-indigo-500 outline-none text-gray-700" placeholder="Case / Vỏ máy"></div>
            </div>
        </td>
        <td class="p-3 align-top">
            <input type="number" value="${qty || 0}" class="v-qty w-full px-2 py-1.5 rounded border border-gray-200 focus:border-indigo-500 outline-none font-semibold text-center text-xs text-gray-800" min="0">
        </td>
        <td class="p-3 align-top">
            <input type="number" value="${price || ''}" class="v-price w-full px-2 py-1.5 rounded border border-gray-200 focus:border-indigo-500 outline-none font-mono text-xs font-bold text-right text-gray-800" placeholder="0">
        </td>
        <td class="p-3 align-top text-center">
            <button onclick="document.getElementById('v-row-${rowId}').remove()" class="w-6 h-6 flex items-center justify-center rounded text-gray-300 hover:text-red-600 hover:bg-red-50 transition-colors">
                <i class="fa-solid fa-xmark text-sm"></i>
            </button>
        </td>
    </tr>`;
}

window.addVariantRow = () => {
    const tbody = document.getElementById('variant-list');
    const emptyMsg = document.getElementById('empty-msg');
    if(emptyMsg) emptyMsg.classList.add('hidden');
    
    const rowId = Date.now();
    tbody.insertAdjacentHTML('beforeend', createVariantRowHtml(rowId, '', '', '', '', '', '', 0, ''));
};

async function collectFormData() {
    const name = document.getElementById('inp-name').value.trim();
    const sku = document.getElementById('inp-sku').value.trim();
    const brand = document.getElementById('inp-brand').value;
    const desc = document.getElementById('inp-desc').value.trim();
    const status = document.getElementById('inp-status').value;
    const isNew = document.getElementById('inp-new').checked;
    const isBest = document.getElementById('inp-best').checked;
    const catCheckboxes = document.querySelectorAll('input[name="cats"]:checked');
    const categoryIds = Array.from(catCheckboxes).map(cb => parseInt(cb.value));

    if (!name || !sku) {
        Swal.showValidationMessage('Vui lòng nhập Tên sản phẩm và Mã SKU!');
        return null;
    }

    const variantRows = document.querySelectorAll('#variant-list tr');
    const variants = [];
    
    variantRows.forEach(row => {
        const vSku = row.querySelector('.v-sku').value.trim();
        const vPrice = row.querySelector('.v-price').value.trim();
        const vQty = row.querySelector('.v-qty').value.trim();

        const vCpu = row.querySelector('.v-cpu').value.trim();
        const vRam = row.querySelector('.v-ram').value.trim();
        const vVga = row.querySelector('.v-vga').value.trim();
        const vSsd = row.querySelector('.v-ssd').value.trim();
        const vCase = row.querySelector('.v-case').value.trim();

        const attributes = {};
        if(vCpu) attributes["CPU"] = vCpu;
        if(vRam) attributes["RAM"] = vRam;
        if(vVga) attributes["VGA"] = vVga;
        if(vSsd) attributes["SSD"] = vSsd;
        if(vCase) attributes["CASE"] = vCase;

        if (vSku && vPrice) {
            variants.push({ 
                sku: vSku, 
                price: parseFloat(vPrice), 
                quantity: parseInt(vQty) || 0,
                attributes 
            });
        }
    });

    const productData = { name, sku, brand, description: desc, status, isNew, isBestSeller: isBest, categoryIds, variants };
    const formData = new FormData();
    formData.append('data', JSON.stringify(productData));
    
    const thumbFile = document.getElementById('inp-thumb').files[0];
    if (thumbFile) formData.append('thumbnail', thumbFile);

    const galleryFiles = document.getElementById('inp-gallery').files;
    for (let i = 0; i < galleryFiles.length; i++) {
        formData.append('gallery', galleryFiles[i]);
    }
    return formData;
}

window.submitProduct = async () => {
    const formData = await collectFormData();
    if (!formData) return;

    Swal.fire({ title: 'Đang xử lý', didOpen: () => Swal.showLoading() });
    try {
        const res = await fetch(PRD_API_URL, {
            method: 'POST',
            headers: { 'X-Actor': getActor() },
            body: formData
        });

        if (res.ok) {
            Swal.fire({ icon: 'success', title: 'Hoàn tất', timer: 1000, showConfirmButton: false });
            loadProducts(0);
        } else {
            Swal.fire('Lỗi', await res.text(), 'error');
        }
    } catch (err) { Swal.fire('Lỗi kết nối', err.message, 'error'); }
};

window.submitUpdateProduct = async (id) => {
    const formData = await collectFormData();
    if (!formData) return;

    Swal.fire({ title: 'Đang lưu...', didOpen: () => Swal.showLoading() });
    try {
        const res = await fetch(`${PRD_API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'X-Actor': getActor() },
            body: formData
        });

        if (res.ok) {
            Swal.fire({ icon: 'success', title: 'Đã cập nhật', timer: 1000, showConfirmButton: false });
            loadProducts(prdCurrentPage);
        } else {
            Swal.fire('Lỗi', await res.text(), 'error');
        }
    } catch (err) { Swal.fire('Lỗi kết nối', err.message, 'error'); }
};

window.confirmDeleteProduct = (id) => {
    Swal.fire({
        title: 'Xóa sản phẩm?',
        text: "Hành động này không thể hoàn tác.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#9ca3af',
        confirmButtonText: 'Xóa ngay',
        cancelButtonText: 'Hủy'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await fetch(`${PRD_API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'X-Actor': getActor() }
            });
            loadProducts(prdCurrentPage);
            Swal.fire({ icon: 'success', title: 'Đã xóa', showConfirmButton: false, timer: 1000 });
        }
    });
};

window.generateVariantSKU = (rowId) => {
    const row = document.getElementById(`v-row-${rowId}`);
    if (!row) return;

    const brand = document.getElementById('inp-brand').value.substring(0, 3).toUpperCase();
    const cpu = row.querySelector('.v-cpu').value.split(' ').pop().toUpperCase();
    const vga = row.querySelector('.v-vga').value.match(/\d{4}/) || ""; 
    const ram = row.querySelector('.v-ram').value.match(/\d+GB/) || ""; 

    const generatedSKU = `${brand}-${cpu}-${vga}-${ram}`.replace(/-+/g, '-').replace(/-$/, '');
    
    row.querySelector('.v-sku').value = generatedSKU;
};