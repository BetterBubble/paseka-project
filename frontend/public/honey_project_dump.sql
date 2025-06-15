-- MySQL dump 10.13  Distrib 9.3.0, for macos15.2 (arm64)
--
-- Host: localhost    Database: myhoneydb
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add Категория',7,'add_category'),(26,'Can change Категория',7,'change_category'),(27,'Can delete Категория',7,'delete_category'),(28,'Can view Категория',7,'view_category'),(29,'Can add Производитель',8,'add_manufacturer'),(30,'Can change Производитель',8,'change_manufacturer'),(31,'Can delete Производитель',8,'delete_manufacturer'),(32,'Can view Производитель',8,'view_manufacturer'),(33,'Can add Регион',9,'add_region'),(34,'Can change Регион',9,'change_region'),(35,'Can delete Регион',9,'delete_region'),(36,'Can view Регион',9,'view_region'),(37,'Can add Товар',10,'add_product'),(38,'Can change Товар',10,'change_product'),(39,'Can delete Товар',10,'delete_product'),(40,'Can view Товар',10,'view_product'),(41,'Can add Способ доставки',11,'add_deliverymethod'),(42,'Can change Способ доставки',11,'change_deliverymethod'),(43,'Can delete Способ доставки',11,'delete_deliverymethod'),(44,'Can view Способ доставки',11,'view_deliverymethod'),(45,'Can add Заказ',12,'add_order'),(46,'Can change Заказ',12,'change_order'),(47,'Can delete Заказ',12,'delete_order'),(48,'Can view Заказ',12,'view_order'),(49,'Can add Товар в заказе',13,'add_orderitem'),(50,'Can change Товар в заказе',13,'change_orderitem'),(51,'Can delete Товар в заказе',13,'delete_orderitem'),(52,'Can view Товар в заказе',13,'view_orderitem'),(53,'Can add Отзыв',14,'add_review'),(54,'Can change Отзыв',14,'change_review'),(55,'Can delete Отзыв',14,'delete_review'),(56,'Can view Отзыв',14,'view_review'),(57,'Can add asexam',15,'add_asexam'),(58,'Can change asexam',15,'change_asexam'),(59,'Can delete asexam',15,'delete_asexam'),(60,'Can view asexam',15,'view_asexam');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$1000000$LmdNvimvgiUALSdVHm65Ap$uTFU5KHkBw0L/IPVkT1Khpo6dsw+c5AmQKQ8VCxVcwY=','2025-06-02 11:41:16.459107',1,'bubble','','','sasha_shulga228@bk.ru',1,1,'2025-06-02 11:40:47.337026');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext COLLATE utf8mb4_unicode_ci,
  `object_repr` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2025-06-02 11:54:26.905392','1','Мёд',1,'[{\"added\": {}}]',7,1),(2,'2025-06-02 11:54:30.372647','2','Соты',1,'[{\"added\": {}}]',7,1),(3,'2025-06-02 11:54:34.030871','3','Прополис',1,'[{\"added\": {}}]',7,1),(4,'2025-06-02 11:54:40.591142','4','Пыльца',1,'[{\"added\": {}}]',7,1),(5,'2025-06-02 11:54:43.125346','5','Воск',1,'[{\"added\": {}}]',7,1),(6,'2025-06-02 11:55:02.567414','1','Пасека Бабла',1,'[{\"added\": {}}]',8,1),(7,'2025-06-02 11:55:27.586029','1','Кабардино-Балкарская Республика',1,'[{\"added\": {}}]',9,1),(8,'2025-06-02 11:56:45.250007','1','Лесной мёд',1,'[{\"added\": {}}]',10,1),(9,'2025-06-02 11:57:28.527057','2','Крем-мёд акациевый',1,'[{\"added\": {}}]',10,1),(10,'2025-06-02 11:58:01.167380','3','Мёд с ромашкой',1,'[{\"added\": {}}]',10,1),(11,'2025-06-02 11:58:39.843800','4','Майский мёд',1,'[{\"added\": {}}]',10,1),(12,'2025-06-02 11:59:11.299177','5','Гречишный мёд',1,'[{\"added\": {}}]',10,1),(13,'2025-06-02 11:59:55.717713','6','Тёмный липовый мёд',1,'[{\"added\": {}}]',10,1),(14,'2025-06-02 12:00:28.916228','7','Подсолнуховый мёд',1,'[{\"added\": {}}]',10,1),(15,'2025-06-02 12:01:04.471874','8','Мёд со сладким клевером',1,'[{\"added\": {}}]',10,1),(16,'2025-06-02 12:03:08.351994','9','Акациевые соты',1,'[{\"added\": {}}]',10,1),(17,'2025-06-02 12:03:59.436011','10','Липовые соты',1,'[{\"added\": {}}]',10,1),(18,'2025-06-02 12:04:37.325561','11','Цветочные соты',1,'[{\"added\": {}}]',10,1),(19,'2025-06-02 12:05:49.335019','12','Соты с мёдом',1,'[{\"added\": {}}]',10,1),(20,'2025-06-02 12:06:21.815324','13','Горные соты',1,'[{\"added\": {}}]',10,1),(21,'2025-06-02 12:06:54.692594','14','Гречишные соты',1,'[{\"added\": {}}]',10,1),(22,'2025-06-02 12:08:03.194499','15','Прополис очищенный',1,'[{\"added\": {}}]',10,1),(23,'2025-06-02 12:08:40.660777','16','Прополис в гранулах',1,'[{\"added\": {}}]',10,1),(24,'2025-06-02 12:09:13.459218','17','Настойка прополиса',1,'[{\"added\": {}}]',10,1),(25,'2025-06-02 12:09:42.630519','18','Прополисный брусок',1,'[{\"added\": {}}]',10,1),(26,'2025-06-02 12:10:08.926586','19','Прополис с мёдом',1,'[{\"added\": {}}]',10,1),(27,'2025-06-02 12:10:46.031507','20','Прополис в масле',1,'[{\"added\": {}}]',10,1),(28,'2025-06-02 12:11:47.360345','21','Пыльца цветочная',1,'[{\"added\": {}}]',10,1),(29,'2025-06-02 12:12:20.353360','22','Пыльца акациевая',1,'[{\"added\": {}}]',10,1),(30,'2025-06-02 12:13:08.732123','23','Натуральный пчелиный воск',1,'[{\"added\": {}}]',10,1),(31,'2025-06-02 12:13:43.162291','24','Воск с прополисом',1,'[{\"added\": {}}]',10,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(6,'sessions','session'),(15,'shop','asexam'),(7,'shop','category'),(11,'shop','deliverymethod'),(8,'shop','manufacturer'),(12,'shop','order'),(13,'shop','orderitem'),(10,'shop','product'),(9,'shop','region'),(14,'shop','review');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-06-02 11:38:56.589858'),(2,'auth','0001_initial','2025-06-02 11:38:56.720789'),(3,'admin','0001_initial','2025-06-02 11:38:56.746022'),(4,'admin','0002_logentry_remove_auto_add','2025-06-02 11:38:56.750223'),(5,'admin','0003_logentry_add_action_flag_choices','2025-06-02 11:38:56.754529'),(6,'contenttypes','0002_remove_content_type_name','2025-06-02 11:38:56.778757'),(7,'auth','0002_alter_permission_name_max_length','2025-06-02 11:38:56.791042'),(8,'auth','0003_alter_user_email_max_length','2025-06-02 11:38:56.800216'),(9,'auth','0004_alter_user_username_opts','2025-06-02 11:38:56.805938'),(10,'auth','0005_alter_user_last_login_null','2025-06-02 11:38:56.818220'),(11,'auth','0006_require_contenttypes_0002','2025-06-02 11:38:56.818632'),(12,'auth','0007_alter_validators_add_error_messages','2025-06-02 11:38:56.821376'),(13,'auth','0008_alter_user_username_max_length','2025-06-02 11:38:56.834991'),(14,'auth','0009_alter_user_last_name_max_length','2025-06-02 11:38:56.861006'),(15,'auth','0010_alter_group_name_max_length','2025-06-02 11:38:56.868590'),(16,'auth','0011_update_proxy_permissions','2025-06-02 11:38:56.872334'),(17,'auth','0012_alter_user_first_name_max_length','2025-06-02 11:38:56.884961'),(18,'sessions','0001_initial','2025-06-02 11:38:56.891020'),(19,'shop','0001_initial','2025-06-02 11:38:56.931398'),(20,'shop','0002_deliverymethod_order_orderitem_review','2025-06-02 11:38:57.009286'),(21,'shop','0003_alter_product_category_alter_product_manufacturer_and_more','2025-06-02 11:38:57.101862'),(22,'shop','0004_alter_product_options_product_created_at','2025-06-02 11:38:57.115048'),(23,'shop','0005_product_product_type','2025-06-02 11:38:57.128129'),(24,'shop','0006_asexam','2025-06-02 11:38:57.157452');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `session_data` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('q5cpz9qlr9j14rp71l04zzae2867n8ao','.eJyFjDEOgzAQBP9yNbJMjG2OMn3egM5nE5xEkBhTRIi_ByQaqjRb7MzuAkwpQ7NAqfb8zDTkmL_QlAW8U-QADdgapZAS1gL0f2mzWppz385TSG30Gyvh1DniZxh24B803EfB45BTdGJXxEEncRt9eF0P93TQ09RvayPZobYGGQmdshV7Y7wnry_UoZeoEC9Yd0EGtNgZpZSx6NhVhqWuLaw_Na5P0Q:1uM46j:Wu9Duppr7G7QQDHZqIuXOJtUdcgyGZZZSCDO1i51pA4','2025-06-16 12:17:37.333193');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_asexam`
--

DROP TABLE IF EXISTS `shop_asexam`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_asexam` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `exam_date` date NOT NULL,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_public` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_asexam`
--

LOCK TABLES `shop_asexam` WRITE;
/*!40000 ALTER TABLE `shop_asexam` DISABLE KEYS */;
/*!40000 ALTER TABLE `shop_asexam` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_asexam_users`
--

DROP TABLE IF EXISTS `shop_asexam_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_asexam_users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `asexam_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shop_asexam_users_asexam_id_user_id_4e3480fc_uniq` (`asexam_id`,`user_id`),
  KEY `shop_asexam_users_user_id_a12c86a9_fk_auth_user_id` (`user_id`),
  CONSTRAINT `shop_asexam_users_asexam_id_8703d360_fk_shop_asexam_id` FOREIGN KEY (`asexam_id`) REFERENCES `shop_asexam` (`id`),
  CONSTRAINT `shop_asexam_users_user_id_a12c86a9_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_asexam_users`
--

LOCK TABLES `shop_asexam_users` WRITE;
/*!40000 ALTER TABLE `shop_asexam_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `shop_asexam_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_category`
--

DROP TABLE IF EXISTS `shop_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_category`
--

LOCK TABLES `shop_category` WRITE;
/*!40000 ALTER TABLE `shop_category` DISABLE KEYS */;
INSERT INTO `shop_category` VALUES (1,'Мёд',''),(2,'Соты',''),(3,'Прополис',''),(4,'Пыльца',''),(5,'Воск','');
/*!40000 ALTER TABLE `shop_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_deliverymethod`
--

DROP TABLE IF EXISTS `shop_deliverymethod`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_deliverymethod` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cost_policy` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_deliverymethod`
--

LOCK TABLES `shop_deliverymethod` WRITE;
/*!40000 ALTER TABLE `shop_deliverymethod` DISABLE KEYS */;
/*!40000 ALTER TABLE `shop_deliverymethod` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_manufacturer`
--

DROP TABLE IF EXISTS `shop_manufacturer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_manufacturer` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_manufacturer`
--

LOCK TABLES `shop_manufacturer` WRITE;
/*!40000 ALTER TABLE `shop_manufacturer` DISABLE KEYS */;
INSERT INTO `shop_manufacturer` VALUES (1,'Пасека Бабла','');
/*!40000 ALTER TABLE `shop_manufacturer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_order`
--

DROP TABLE IF EXISTS `shop_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `delivery_address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `delivery_method_id` bigint DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_order_delivery_method_id_bd566c44_fk_shop_deliverymethod_id` (`delivery_method_id`),
  KEY `shop_order_user_id_00aba627_fk_auth_user_id` (`user_id`),
  CONSTRAINT `shop_order_delivery_method_id_bd566c44_fk_shop_deliverymethod_id` FOREIGN KEY (`delivery_method_id`) REFERENCES `shop_deliverymethod` (`id`),
  CONSTRAINT `shop_order_user_id_00aba627_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_order`
--

LOCK TABLES `shop_order` WRITE;
/*!40000 ALTER TABLE `shop_order` DISABLE KEYS */;
/*!40000 ALTER TABLE `shop_order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_orderitem`
--

DROP TABLE IF EXISTS `shop_orderitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_orderitem` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `quantity` int unsigned NOT NULL,
  `price_at_purchase` decimal(10,2) NOT NULL,
  `order_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_orderitem_order_id_2f1b00cf_fk_shop_order_id` (`order_id`),
  KEY `shop_orderitem_product_id_48153f22_fk_shop_product_id` (`product_id`),
  CONSTRAINT `shop_orderitem_order_id_2f1b00cf_fk_shop_order_id` FOREIGN KEY (`order_id`) REFERENCES `shop_order` (`id`),
  CONSTRAINT `shop_orderitem_product_id_48153f22_fk_shop_product_id` FOREIGN KEY (`product_id`) REFERENCES `shop_product` (`id`),
  CONSTRAINT `shop_orderitem_chk_1` CHECK ((`quantity` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_orderitem`
--

LOCK TABLES `shop_orderitem` WRITE;
/*!40000 ALTER TABLE `shop_orderitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `shop_orderitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_product`
--

DROP TABLE IF EXISTS `shop_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_product` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `stock_quantity` int unsigned NOT NULL,
  `image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` bigint NOT NULL,
  `manufacturer_id` bigint NOT NULL,
  `region_id` bigint NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `product_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_product_category_id_14d7eea8_fk_shop_category_id` (`category_id`),
  KEY `shop_product_manufacturer_id_aa6d23e4_fk_shop_manufacturer_id` (`manufacturer_id`),
  KEY `shop_product_region_id_0a65116c_fk_shop_region_id` (`region_id`),
  CONSTRAINT `shop_product_category_id_14d7eea8_fk_shop_category_id` FOREIGN KEY (`category_id`) REFERENCES `shop_category` (`id`),
  CONSTRAINT `shop_product_manufacturer_id_aa6d23e4_fk_shop_manufacturer_id` FOREIGN KEY (`manufacturer_id`) REFERENCES `shop_manufacturer` (`id`),
  CONSTRAINT `shop_product_region_id_0a65116c_fk_shop_region_id` FOREIGN KEY (`region_id`) REFERENCES `shop_region` (`id`),
  CONSTRAINT `shop_product_chk_1` CHECK ((`stock_quantity` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_product`
--

LOCK TABLES `shop_product` WRITE;
/*!40000 ALTER TABLE `shop_product` DISABLE KEYS */;
INSERT INTO `shop_product` VALUES (1,'Лесной мёд','Тёмный, насыщенный мёд, собранный с дикорастущих лесных растений. Отличается терпким вкусом, высоким содержанием дубильных веществ и антиоксидантов. Рекомендуется при простудах и для укрепления иммунитета.',8290.00,NULL,19,'products/Forest_honey_6_26cQrk2.png',1,1,1,'2025-06-02 11:55:44.000000','honey'),(2,'Крем-мёд акациевый','Нежный кремообразный мёд, приготовленный из акациевого сорта методом взбивания при низкой температуре. Подходит для детей и людей с чувствительным ЖКТ.',7490.00,6990.00,21,'products/Acacia_honey_cream_5_sRotbvA.png',1,1,1,'2025-06-02 11:56:45.000000','honey'),(3,'Мёд с ромашкой','Цветочный мёд с добавлением экстракта аптечной ромашки. Успокаивает слизистые, помогает при воспалении горла и кашле, улучшает сон.',7190.00,NULL,7,'products/Flower_honey_with_chamomile_4_YbMPDDM.png',1,1,1,'2025-06-02 11:57:28.000000','honey'),(4,'Майский мёд','Самый первый мёд сезона, собранный в мае. Имеет светлый цвет и приятный цветочный аромат. Богат витаминами группы B и естественными сахарами.',6990.00,3990.00,13,'products/May_honey_3_e0CXEOz.png',1,1,1,'2025-06-02 11:58:01.000000','honey'),(5,'Гречишный мёд','Сорт мёда с характерным тёмным цветом и насыщенным ароматом гречки. Содержит много железа, применяется при анемии и истощении.',7890.00,NULL,31,'products/Buckwheat_honey_2_FULwMYu.png',1,1,1,'2025-06-02 11:58:39.000000','honey'),(6,'Тёмный липовый мёд','Уникальный сорт липового мёда, собранный в вечерние часы. Имеет янтарный цвет, противовоспалительные и жаропонижающие свойства.',7990.00,6490.00,11,'products/Dark_lime_honey_1_dnuXNdB.png',1,1,1,'2025-06-02 11:59:11.000000','honey'),(7,'Подсолнуховый мёд','Золотисто-жёлтый мёд с подсолнечника, быстро кристаллизуется. Имеет высокий уровень глюкозы, отлично подходит для энергетического восстановления.',6990.00,NULL,3,'products/Sunflower_honey_7_qZs5cKf.png',1,1,1,'2025-06-02 11:59:55.000000','honey'),(8,'Мёд со сладким клевером','Ароматный мёд с нотами ванили и пряности. Полезен при стрессах, обладает мягким седативным эффектом.',7390.00,NULL,4,'products/Sweet_clover_honey_8_zwtzZfY.png',1,1,1,'2025-06-02 12:00:28.000000','honey'),(9,'Акациевые соты','Соты с акациевым мёдом, собранные вручную. Обладают нежным вкусом и тонким ароматом акации. Подходят для десертов и натурального употребления.',7590.00,6990.00,23,'products/acacia_honeycombs_1_3afTD4l.png',2,1,1,'2025-06-02 12:01:04.000000','comb'),(10,'Липовые соты','Натуральные соты, наполненные липовым мёдом. Отличаются насыщенным вкусом и противовоспалительными свойствами.',7490.00,6990.00,20,'products/linden_honeycombs_2_ZPuaqqW.png',2,1,1,'2025-06-02 12:03:08.000000','comb'),(11,'Цветочные соты','Ароматные соты с цветочным мёдом. Многообразие нектаров делает вкус насыщенным, идеально подходят для иммуноподдержки.',7350.00,6850.00,18,'products/flower_honeycombs_3_EdrNI7T.png',2,1,1,'2025-06-02 12:03:59.000000','comb'),(12,'Соты с мёдом','Классические соты, наполненные тягучим мёдом. Продукт прямого среза, сохраняет максимальные питательные свойства.',7690.00,7090.00,15,'products/honey_filled_combs_4_B5eoDhC.png',2,1,1,'2025-06-02 12:04:37.000000','comb'),(13,'Горные соты','Соты, собранные в горных пасеках. Содержат мёд из редких высокогорных трав. Богаты антиоксидантами и микроэлементами.',7890.00,7390.00,13,'products/mountain_honeycombs_5_lDzHz0d.png',2,1,1,'2025-06-02 12:05:49.000000','comb'),(14,'Гречишные соты','Соты с тёмным и насыщенным гречишным мёдом. Укрепляют сосуды, обладают мощным антибактериальным эффектом.',7390.00,6890.00,5,'products/buckwheat_honeycombs_6_8XNatHV.png',2,1,1,'2025-06-02 12:06:21.000000','comb'),(15,'Прополис очищенный','Натуральный очищенный пчелиный прополис. Используется в домашней медицине и косметологии. Обладает мощными антисептическими и противогрибковыми свойствами.',2390.00,1990.00,32,'products/purified_propolis_1_E1z0KHH.png',3,1,1,'2025-06-02 12:06:54.000000','propolis'),(16,'Прополис в гранулах','Удобный формат прополиса для настоек и жевания. Укрепляет иммунитет, помогает при воспалениях и респираторных заболеваниях.',2590.00,2190.00,27,'products/granulated_propolis_2_9m8ZOia.png',3,1,1,'2025-06-02 12:08:03.000000','propolis'),(17,'Настойка прополиса','Спиртовая настойка 20%. Универсальное средство от простуд, для полоскания горла, ингаляций и наружного применения.',2790.00,2390.00,25,'products/propolis_tincture_3_lTgYMMX.png',3,1,1,'2025-06-02 12:08:40.000000','propolis'),(18,'Прополисный брусок','Твёрдый брусок прополиса. Используется для натираний, ингаляций и создания домашних лечебных мазей.',2290.00,1890.00,21,'products/propolis_block_4_ftTa2M2.png',3,1,1,'2025-06-02 12:09:13.000000','propolis'),(19,'Прополис с мёдом','Смесь мёда и прополиса. Отличный иммуностимулятор. Подходит для употребления в чистом виде или с тёплой водой.',3190.00,NULL,10,'products/propolis_honey_mix_5_3YXdDZH.png',3,1,1,'2025-06-02 12:09:42.000000','propolis'),(20,'Прополис в масле','Прополис, настоянный на натуральном масле. Идеален для ухода за кожей, лечения ран, ожогов и дерматитов.',2690.00,2290.00,24,'products/propolis_oil_6_vJmrHtv.png',3,1,1,'2025-06-02 12:10:08.000000','propolis'),(21,'Пыльца цветочная','Богатый источник витаминов и аминокислот. Улучшает обмен веществ, повышает уровень энергии и выносливость.',1990.00,1690.00,10,'products/flower_pollen_1_gMexDw7.png',4,1,1,'2025-06-02 12:10:46.000000','bee_pollen'),(22,'Пыльца акациевая','Светлая, мягкая по вкусу пыльца. Рекомендуется для ежедневного приёма. Укрепляет иммунитет и способствует восстановлению организма.',2090.00,1790.00,28,'products/acacia_pollen_2_h4gWNmW.png',4,1,1,'2025-06-02 12:11:47.000000','bee_pollen'),(23,'Натуральный пчелиный воск','Чистый, неотбеленный воск, идеально подходит для изготовления свечей, косметических и медицинских средств.',1590.00,1390.00,35,'products/natural_beeswax_1_npo1cw2.png',5,1,1,'2025-06-02 12:12:20.000000','wax'),(24,'Воск с прополисом','Обогащённый прополисом воск. Имеет антибактериальные свойства, подходит для бальзамов и мазей.',1790.00,1490.00,51,'products/propolis_beeswax_2_uOqEG5V.png',5,1,1,'2025-06-02 12:13:08.000000','wax');
/*!40000 ALTER TABLE `shop_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_region`
--

DROP TABLE IF EXISTS `shop_region`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_region` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_region`
--

LOCK TABLES `shop_region` WRITE;
/*!40000 ALTER TABLE `shop_region` DISABLE KEYS */;
INSERT INTO `shop_region` VALUES (1,'Кабардино-Балкарская Республика');
/*!40000 ALTER TABLE `shop_region` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shop_review`
--

DROP TABLE IF EXISTS `shop_review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shop_review` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `rating` int NOT NULL,
  `comment` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `product_id` bigint NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `shop_review_product_id_f74dddfd_fk_shop_product_id` (`product_id`),
  KEY `shop_review_user_id_02dce754_fk_auth_user_id` (`user_id`),
  CONSTRAINT `shop_review_product_id_f74dddfd_fk_shop_product_id` FOREIGN KEY (`product_id`) REFERENCES `shop_product` (`id`),
  CONSTRAINT `shop_review_user_id_02dce754_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shop_review`
--

LOCK TABLES `shop_review` WRITE;
/*!40000 ALTER TABLE `shop_review` DISABLE KEYS */;
/*!40000 ALTER TABLE `shop_review` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-02 15:57:21
