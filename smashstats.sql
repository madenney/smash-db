-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Apr 06, 2018 at 10:12 PM
-- Server version: 5.7.21-0ubuntu0.16.04.1
-- PHP Version: 7.0.28-0ubuntu0.16.04.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smashstats`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_log`
--

CREATE TABLE `activity_log` (
  `id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `error_log`
--

CREATE TABLE `error_log` (
  `id` int(11) NOT NULL,
  `type` varchar(64) DEFAULT NULL,
  `tournament` varchar(264) DEFAULT NULL,
  `message` varchar(256) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `slug` varchar(264) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `players`
--

CREATE TABLE `players` (
  `id` int(11) NOT NULL,
  `tag` varchar(250) DEFAULT NULL,
  `rank` smallint(6) DEFAULT NULL,
  `region` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `sets`
--

CREATE TABLE `sets` (
  `id` int(11) NOT NULL,
  `winner_id` int(11) NOT NULL,
  `loser_id` int(11) NOT NULL,
  `winner_tag` varchar(250) NOT NULL,
  `loser_tag` varchar(250) NOT NULL,
  `tournament_id` int(11) NOT NULL,
  `best_of` int(11) DEFAULT NULL,
  `winner_score` int(11) DEFAULT NULL,
  `loser_score` int(11) DEFAULT NULL,
  `round` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tournaments`
--

CREATE TABLE `tournaments` (
  `id` int(10) UNSIGNED NOT NULL,
  `title` varchar(256) NOT NULL,
  `start_date` varchar(64) DEFAULT NULL,
  `end_date` varchar(64) DEFAULT NULL,
  `slug` varchar(256) NOT NULL,
  `city` varchar(64) NOT NULL,
  `state` varchar(64) NOT NULL,
  `zip` varchar(64) NOT NULL,
  `country` varchar(64) NOT NULL,
  `address` varchar(256) NOT NULL,
  `entrants` smallint(6) DEFAULT NULL,
  `sets` smallint(6) NOT NULL,
  `image_url` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_log`
--
ALTER TABLE `activity_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `error_log`
--
ALTER TABLE `error_log`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `players`
--
ALTER TABLE `players`
  ADD KEY `id` (`id`);

--
-- Indexes for table `sets`
--
ALTER TABLE `sets`
  ADD KEY `id` (`id`);

--
-- Indexes for table `tournaments`
--
ALTER TABLE `tournaments`
  ADD KEY `id` (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_log`
--
ALTER TABLE `activity_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `error_log`
--
ALTER TABLE `error_log`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=660;
--
-- AUTO_INCREMENT for table `players`
--
ALTER TABLE `players`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45786;
--
-- AUTO_INCREMENT for table `sets`
--
ALTER TABLE `sets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=483375;
--
-- AUTO_INCREMENT for table `tournaments`
--
ALTER TABLE `tournaments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4460;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
