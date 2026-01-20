document.addEventListener("DOMContentLoaded", () => {
  const allLinks = document.querySelectorAll("#sidebar-menu .menu-item");
  const pageTitle = document.getElementById("page-title");
  const mainView = document.getElementById("main-view");

  allLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      allLinks.forEach((item) => item.classList.remove("active"));
      this.classList.add("active");

      const title = this.innerText.trim();
      pageTitle.innerText = title;
      mainView.innerHTML = "";

      const currentPage = this.getAttribute("data-page");

      switch (currentPage) {
        case "categories":
          loadCategoriesPage();
          break;
        case "dashboard":
          console.log("Load Dashboard Logic...");
          break;
        case "inventory":
          loadInventoryPage();
          break;
        case "supplier":
          loadSupplierPage();
          break;
        case "user":
          loadUserPage();
          break;
        case "customers":
          loadCustomerPage();
          break;
         case "products":
          loadProducts();
          break;
      }
    });
  });
});
