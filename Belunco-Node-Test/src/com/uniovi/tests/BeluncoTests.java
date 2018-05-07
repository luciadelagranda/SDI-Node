package com.uniovi.tests;

import static org.junit.Assert.*;

import java.util.List;

import org.junit.*;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;

import com.uniovi.tests.pageobjects.PO_HomeView;
import com.uniovi.tests.pageobjects.PO_LoginView;
import com.uniovi.tests.pageobjects.PO_PrivateView;
import com.uniovi.tests.pageobjects.PO_PublicationView;
import com.uniovi.tests.pageobjects.PO_RegisterView;
import com.uniovi.tests.pageobjects.PO_View;
import com.uniovi.tests.utils.SeleniumUtils;

//Ordenamos las pruebas por el nombre del método
@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class BeluncoTests {


	static String PathFirefox = "C:\\Firefox46.win\\FirefoxPortable.exe";

	static WebDriver driver = getDriver(PathFirefox);
	static String URL = "http://localhost:8081";

	String email;
	
	public static WebDriver getDriver(String PathFirefox) {
		System.setProperty("webdriver.firefox.bin", PathFirefox);
		WebDriver driver = new FirefoxDriver();
		return driver;
	}

	@Before
	public void setUp() {
		this.email = SeleniumUtils.creaEmail();
		driver.navigate().to(URL);
	}

	@After
	public void tearDown() {
		driver.manage().deleteAllCookies();
	}

	@BeforeClass
	static public void begin() {
		
	}

	@AfterClass
	static public void end() {
		driver.quit();
	}

	@Test
	public void ARegVal() {
//		this.email = SeleniumUtils.creaEmail();
		PO_HomeView.clickOption(driver, "/registrarse", "class", "btn btn-primary");
		PO_RegisterView.fillForm(driver, this.email, "belunco", "belunco", "belunco");
		PO_View.checkElement(driver, "text", "Lista de usuarios");
		PO_PrivateView.clickOption(driver, "/desconectarse", "text", "Identifícate");
	}
  
	@Test 
	public void BRegInval() {
		PO_HomeView.clickOption(driver, "/registrarse", "class", "btn btn-primary");
		PO_RegisterView.fillForm(driver, "hulioo@uniovi.es", "belunco", "belunco", "beluncoo");
		PO_View.checkElement(driver, "text", "Las contraseñas deben coincidir");
	}

	@Test 
	public void CInVal() {
		PO_HomeView.clickOption(driver, "/identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "x@x.com", "x");
		PO_View.checkElement(driver, "text", "Lista de usuarios");
		PO_PrivateView.clickOption(driver, "/desconectarse", "text", "Identifícate");
	}

	@Test 
	public void DInInVal() {
		PO_HomeView.clickOption(driver, "/identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "ininval@uniovi.es", "regval");
		PO_View.checkElement(driver, "text", "Email o password incorrecto.");
	}

	@Test 
	public void ELisUsrVal() {
		PO_HomeView.clickOption(driver, "/identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "x@x.com", "x");
		PO_View.checkElement(driver, "text", "Lista de usuarios");
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr",
				10);
		assertTrue(elementos.size() == 5);
		// Ahora nos desconectamos
		PO_PrivateView.clickOption(driver, "/desconectarse", "text", "Identifícate");
	}

	@Test 
	public void FLisUsrInVal() {
		driver.navigate().to("http://localhost:8081/listar");
		PO_View.checkElement(driver, "text", "Identifícate");
	}

	@Test 
	public void GBusUsrVal() {
		PO_HomeView.clickOption(driver, "/identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "x@x.com", "x");
		PO_View.checkElement(driver, "text", "Lista de usuarios");
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", 10);
		assertTrue(elementos.size() == 5);
		WebElement busqueda = driver.findElement(By.name("busqueda"));
		busqueda.click();
		busqueda.clear();
		busqueda.sendKeys("belu");
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "class", "btn", 2);
		elementos.get(0).click();
		PO_PrivateView.clickOption(driver, "/desconectarse", "text", "Identifícate");
	}

	@Test 
	public void HBusUsrInVal() {
		driver.navigate().to("http://localhost:8081/listar?busqueda=x");
		PO_View.checkElement(driver, "text", "Identifícate");
	}


	@Test 
	public void IInvVal() {
		PO_HomeView.clickOption(driver, "/identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "x@x.com", "x");
		PO_View.checkElement(driver, "text", "Lista de usuarios");
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", 10);
		assertTrue(elementos.size() == 5);
		WebElement busqueda = driver.findElement(By.name("busqueda"));
		busqueda.click();
		busqueda.clear();
		busqueda.sendKeys(this.email);
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "class", "btn", 2);
		elementos.get(0).click();
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "text", "ENVIAR PETICION", 2);
		elementos.get(0).click();
		PO_PrivateView.clickOption(driver, "/desconectarse", "text", "Identifícate");
	}


	@Test
  public void JInvInVal() {
		PO_HomeView.clickOption(driver, "/identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "x@x.com", "x");
		PO_View.checkElement(driver, "text", "Lista de usuarios");
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", 10);
		assertTrue(elementos.size() == 5);
		WebElement busqueda = driver.findElement(By.name("busqueda"));
		busqueda.click();
		busqueda.clear();
		busqueda.sendKeys("belu");
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "class", "btn", 2);
		elementos.get(0).click();
		PO_View.checkElement(driver, "text", "PETICION ENVIADA");
		PO_PrivateView.clickOption(driver, "/desconectarse", "text", "Identifícate");
	}

	@Test 
	public void KLisInvVal() {
		PO_HomeView.clickOption(driver, "/registrarse", "class", "btn btn-primary");
		PO_RegisterView.fillForm(driver, SeleniumUtils.creaEmail(), "belunco", "belunco", "belunco");
		PO_View.checkElement(driver, "text", "Lista de usuarios");
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", 10);
		assertTrue(elementos.size() == 5);
		WebElement busqueda = driver.findElement(By.name("busqueda"));
		busqueda.click();
		busqueda.clear();
		busqueda.sendKeys("x");
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "class", "btn", 2);
		elementos.get(0).click();
		elementos = SeleniumUtils.EsperaCargaPagina(driver, "text", "ENVIAR PETICION", 2);
		elementos.get(0).click();
		PO_PrivateView.clickOption(driver, "/desconectarse", "text", "Identifícate");

		PO_HomeView.clickOption(driver, "/identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "x@x.com", "x");
		PO_View.checkElement(driver, "text", "Lista de usuarios");
		List<WebElement> elementos2 = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", 10);
		assertTrue(elementos2.size() == 5);
		PO_HomeView.clickOption(driver, "/listarPeticiones", "text", "Peticiones amistad");
		PO_View.checkElement(driver, "text", "Lista de peticiones de amistad");
		List<WebElement> elementos3 = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", 10);
		assertTrue(elementos3.size() >= 1);
		PO_PrivateView.clickOption(driver, "/desconectarse", "text", "Identifícate");
	}

	@Test 
	public void LAcepInvVal() {
		PO_HomeView.clickOption(driver, "/identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "x@x.com", "x");
		PO_View.checkElement(driver, "text", "Lista de usuarios");
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", 10);
		assertTrue(elementos.size() == 5);
		PO_HomeView.clickOption(driver, "/listarPeticiones", "text", "Peticiones amistad");
		PO_View.checkElement(driver, "text", "Lista de peticiones de amistad");
		List<WebElement> elementos2 = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", 10);
		elementos2 = SeleniumUtils.EsperaCargaPagina(driver, "text", "ACEPTAR SOLICITUD", 10);
		elementos2.get(0).click();
		PO_PrivateView.clickOption(driver, "/desconectarse", "text", "Identifícate");
	}


	@Test 
	public void MListAmiVal() {
		PO_HomeView.clickOption(driver, "/identificarse", "class", "btn btn-primary");
		PO_LoginView.fillForm(driver, "x@x.com", "x");
		PO_HomeView.clickOption(driver, "/amigos", "text", "Amigos");
		PO_View.checkElement(driver, "text", "Lista de amigos");
		List<WebElement> elementos = SeleniumUtils.EsperaCargaPagina(driver, "free", "//tbody/tr", 10);
		assertTrue(elementos.size() >= 1);
		PO_PrivateView.clickOption(driver, "/desconectarse", "text", "Identifícate");
	}

}
