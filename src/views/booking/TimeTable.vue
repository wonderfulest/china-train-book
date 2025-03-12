<template>
  <div class="search-results">
    <div class="search-header">
      <div class="search-params">
        <div class="param">
          <label>From</label>
          <el-autocomplete id="from-search" v-model="from" :fetch-suggestions="querySearch" placeholder="Enter departure city" class="full-width" :trigger-on-focus="true" popper-class="city-autocomplete" @select="handleSelect">
            <template #prefix>
              <el-icon><Location /></el-icon>
            </template>
            <template #default="{ item }">
              <div class="suggestion-group">
                <div class="suggestion-group-label">{{ item.label }}</div>
                <div class="suggestion-list">
                  <div v-for="city in item.cities" :key="city.stationCode" class="suggestion-item" @click.stop="handleSelect(city)">
                    <span v-html="city.displayPinyin"></span>
                  </div>
                </div>
              </div>
            </template>
          </el-autocomplete>
        </div>
        <div class="exchange-button">
          <el-icon class="swap-icon" @click="swapLocations"><Switch /></el-icon>
        </div>
        <div class="param">
          <label>To</label>
          <el-autocomplete id="to-search" v-model="to" :fetch-suggestions="querySearch" placeholder="Enter destination city" class="full-width" :trigger-on-focus="true" popper-class="city-autocomplete" @select="handleSelect">
            <template #prefix>
              <el-icon><Location /></el-icon>
            </template>
            <template #default="{ item }">
              <div class="suggestion-group">
                <div class="suggestion-group-label">{{ item.label }}</div>
                <div class="suggestion-list">
                  <div v-for="city in item.cities" :key="city.stationCode" class="suggestion-item" @click.stop="handleSelect(city)">
                    <span v-html="city.displayPinyin"></span>
                  </div>
                </div>
              </div>
            </template>
          </el-autocomplete>
        </div>
        <div class="param">
          <label>Date</label>
          <el-date-picker v-model="date" type="date" placeholder="Select Date" :disabled-date="disabledDate" format="YYYY-MM-DD" value-format="YYYY-MM-DD" :shortcuts="dateShortcuts" style="width: 100%" />
        </div>
        <el-button type="primary" class="search-btn" @click="searchTrains">Search</el-button>
      </div>
      <div class="filters">
        <div class="filter-group">
          <label>Train Type:</label>
          <el-select v-model="trainType" placeholder="All Trains" class="filter-select">
            <el-option label="All Trains" value="" />
            <el-option label="High Speed G" value="G" />
            <el-option label="High Speed D" value="D" />
            <el-option label="Normal K" value="K" />
          </el-select>
        </div>
        <div class="filter-group">
          <label>Depart Times:</label>
          <el-select v-model="departTime" placeholder="All Times" class="filter-select">
            <el-option label="All Times" value="" />
            <el-option label="Morning (6:00-12:00)" value="morning" />
            <el-option label="Afternoon (12:00-18:00)" value="afternoon" />
            <el-option label="Evening (18:00-24:00)" value="evening" />
          </el-select>
        </div>
        <div class="filter-group">
          <label>Depart Stations:</label>
          <el-select v-model="departStation" placeholder="All Stations" class="filter-select">
            <el-option label="All Stations" value="" />
            <el-option label="Shanghai Hongqiao" value="hongqiao" />
            <el-option label="Shanghai" value="shanghai" />
          </el-select>
        </div>
      </div>
    </div>

    <div class="results-list">
      <el-empty v-if="!loading && trains.length === 0" description="No trains found" />
      <el-skeleton v-if="loading" :rows="3" animated />

      <template v-if="!loading && trains.length > 0">

        <div v-for="train in trains" :key="train.id" class="train-card" :class="{ 'expanded': train.expanded }">
          <div class="train-item">
            <!-- Departure information -->
            <div class="col departure-section">
              <div class="time-large">{{ train.departTime }}</div>
              <div class="station">{{ train.departStation }}</div>
            </div>

            <!-- Connection line with distance -->
            <div class="col connection-section">
              <div class="distance">{{ train.distance || "34m" }}</div>
              <div class="connection-line">
                <div class="connection-dot start"></div>
                <div class="connection-dot end"></div>
              </div>
            </div>

            <!-- Arrival information -->
            <div class="col arrival-section">
              <div class="time-large">{{ train.arrivalTime }}</div>
              <div class="station">{{ train.arrivalStation }}</div>
            </div>

            <!-- Train type info -->
            <div class="train-info-section">
              <div class="train-type-tag">BULLET TRAIN</div>
              <div class="train-number">Train #{{ train.number }}</div>
            </div>

            <!-- Price section as separate column -->
            <div class="price-section-column">
              <div class="from-price">
                from <span class="price-value">{{ currencySymbol }}{{ convertPrice(train.minPrice) || 36 }}</span>
              </div>
              <div class="train-date">{{ formatDate(date) }}</div>
            </div>

            <!-- Select Seats / Cancel button as separate column -->
            <div class="action-column">
              <el-button 
                :type="train.expanded ? 'danger' : 'primary'" 
                :class="['action-btn', train.expanded ? 'cancel-btn' : 'select-seats-btn']"
                @click="train.expanded ? (train.expanded = false) : expandDetails(train)">
                {{ train.expanded ? 'Cancel' : 'Select Seats' }}
              </el-button>
            </div>
          </div>

          <!-- Inline train details section -->
          <div v-if="train.expanded" class="inline-train-details">
           
            <div class="dialog-important-note">
              <strong>IMPORTANT:</strong> Boarding pass should be redeemed in ticket machine at the train station. Child tickets are available for children less than 1.5m in height. Infants less than 1.2m in height can travel for free without own
              seat or bed.
            </div>

            <div class="dialog-content">
              <div class="dialog-seat-selection-layout">
                <!-- Left side: Seat image container -->
                <div class="dialog-seat-image-container">
                  <img :src="selectedSeatImage" alt="Seat image" class="dialog-seat-image" />
                  <div class="dialog-seat-description">
                    This is the most comfortable and top-notch travel class onboard the high-speed Fuxing Hao train.
                    <a href="#" class="show-more-link">Show more</a>
                  </div>
                  <div class="dialog-image-navigation">
                    <button class="nav-button prev" @click="prevSeatImage"><i class="el-icon-arrow-left"></i></button>
                    <button class="nav-button next" @click="nextSeatImage"><i class="el-icon-arrow-right"></i></button>
                  </div>
                </div>
                
                <!-- Right side: Seat options -->
                <div class="dialog-seat-options">
                  <div v-for="(seat, index) in train.seats" :key="seat.type" class="dialog-seat-option" :class="{ selected: selectedSeatIndex === index }" @click="selectSeat(index)">
                    <div class="dialog-seat-info">
                      <div class="dialog-seat-type">{{ seat.type }}</div>
                      <div class="dialog-seat-amenities">
                        <img v-for="amenity in seat.amenities" :key="amenity" :src="`/src/assets/amenities/${amenity}.png`" :alt="amenity" class="dialog-amenity-icon" />
                      </div>
                    </div>

                    <div class="dialog-seat-price-section" :class="{ 'selected-price-section': selectedSeatIndex === index }">
                      <div class="dialog-price">
                        <div class="dialog-price-currency">{{ currencySymbol }}</div>
                        <div class="dialog-price-amount">{{ convertPrice(seat.price) }}</div>
                      </div>
                      <div class="dialog-per-seat">Per seat</div>
                      <el-button v-if="selectedSeatIndex === index" type="primary" class="dialog-book-btn" @click="goToCreateOrder(train, seat)">Book</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="dialog-footer">
              <div class="dialog-total">
                Total amount for 1 passenger: <span class="dialog-total-price">{{ currencySymbol }}{{ selectedSeatIndex >= 0 && train.seats ? convertPrice(train.seats[selectedSeatIndex].price) : convertPrice(train.minPrice) }}</span>
              </div>
              <el-button type="primary" class="dialog-continue-btn" @click="goToCreateOrder(train, selectedSeatIndex >= 0 && train.seats ? train.seats[selectedSeatIndex] : train.seats[0])"> Continue <i class="el-icon-arrow-right"></i> </el-button>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { format } from "date-fns";
import { Switch, Location, Close } from "@element-plus/icons-vue";
import { useBookingStore } from "@/stores/bookingProcess";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getTicketList } from "@/api/modules/train";
import { getExchangeRate } from "@/api/modules/exchange";
import { useCityStore } from "@/stores/city";
import { useCurrencyStore } from "@/stores/currencyStore";
import { storeToRefs } from "pinia";

const route = useRoute();
const router = useRouter();
const cityStore = useCityStore();
const currencyStore = useCurrencyStore();
const { allCities, hotCities } = storeToRefs(cityStore);
const { currency, currencySymbol } = storeToRefs(currencyStore);

// 转换城市数据格式
const cities = computed(() =>
  allCities.value.map((station) => ({
    value: station.pingYin,
    name: station.pingYin,
    stationCode: station.stationCode,
    label: `${station.name} - ${station.pingYin}`,
  }))
);

const localHotCities = computed(() =>
  hotCities.value.map((station) => ({
    value: station.pingYin,
    name: station.pingYin,
    stationCode: station.stationCode,
    label: `${station.name} - ${station.pingYin}`,
  }))
);

const from = ref("");
const to = ref("");
const fromStation = ref(null);
const toStation = ref(null);
const date = ref("");
const trainType = ref("");
const departTime = ref("");
const departStation = ref("");
const trains = ref([]);
const loading = ref(false);
const searchQuery = ref("");
const exchangeRates = ref({});
const dialogVisible = ref(false);
const selectedTrain = ref(null);
const selectedSeatIndex = ref(0);
const currentImageIndex = ref(0);

// Mapping of seat types to image paths
const seatImageMap = {
  "Business Class": ["/src/assets/seats/CHR_business_01.png", "/src/assets/seats/CHR_business_02.png"],
  "First Class": ["/src/assets/seats/CHR-1st-01.png", "/src/assets/seats/CHR-1st-02.png"],
  "Second Class": ["/src/assets/seats/CHR-2st-01.png"],
};

// Computed property to get the current seat image
const selectedSeatImage = computed(() => {
  if (!selectedTrain.value || !selectedTrain.value.seats || selectedTrain.value.seats.length === 0) {
    return "/src/assets/seats/CHR_business_01.png"; // Default image
  }

  const seat = selectedTrain.value.seats[selectedSeatIndex.value];
  const images = seatImageMap[seat.type] || ["/src/assets/seats/CHR_business_01.png"];
  return images[currentImageIndex.value % images.length];
});

// 获取汇率
const fetchExchangeRate = async () => {
  try {
    // 模拟汇率数据 - 实际应用中应该调用API
    // 支持的货币: USD, CNY, EUR, SGD, JPY
    const mockRates = {
      USD: 0.13810000,
      CNY: 1.0,
      EUR: 0.12760000,
      SGD: 0.18650000,
      JPY: 20.8500000
    };
    
    // 设置所有汇率
    exchangeRates.value = mockRates;
    
    // 实际API调用示例：
    // 对于每种支持的货币，获取从CNY到该货币的汇率
    // const currencies = ['USD', 'EUR', 'SGD', 'JPY'];
    // for (const curr of currencies) {
    //   if (curr !== 'CNY') { // CNY到CNY汇率为1
    //     const response = await getExchangeRate('CNY', curr);
    //     if (response.code === "0" && response.data?.exchangeRate) {
    //       const rate = parseFloat(response.data.exchangeRate.exchangeRate);
    //       exchangeRates.value[curr] = rate * (1 - 0.005); // 加上千分之五的汇差
    //     }
    //   }
    // }
    // exchangeRates.value['CNY'] = 1.0; // CNY到CNY汇率为1
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    ElMessage.error("无法加载汇率数据");
  }
};

const initialize = async () => {
  loading.value = true;
  try {
    await Promise.all([fetchExchangeRate(), cityStore.initializeCityData()]);

    // 如果URL中有参数，查找对应的车站信息
    const { from: fromCode, to: toCode, date: dateStr } = route.query;

    if (fromCode) {
      const station = cities.value.find((c) => c.stationCode === fromCode);
      if (station) {
        fromStation.value = station;
        from.value = station.value;
      }
    }

    if (toCode) {
      const station = cities.value.find((c) => c.stationCode === toCode);
      if (station) {
        toStation.value = station;
        to.value = station.value;
      }
    }

    if (dateStr) {
      try {
        // 将日期字符串解析为 YYYY-MM-DD 格式
        const parsedDate = new Date(dateStr);
        if (!isNaN(parsedDate.getTime())) {
          date.value = parsedDate.toISOString().split("T")[0];
        } else {
          date.value = new Date().toISOString().split("T")[0];
        }
      } catch {
        date.value = new Date().toISOString().split("T")[0];
      }
    } else {
      date.value = new Date().toISOString().split("T")[0];
    }

    // 如果有完整的查询参数，自动搜索
    if (fromStation.value && toStation.value && date.value) {
      searchTrains();
    }
  } catch (error) {
    console.error("Failed to initialize:", error);
    ElMessage.error("Failed to load data");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  initialize();

  // 设置当前步骤为Timetable阶段（索引为1）
  const bookingStore = useBookingStore();
  bookingStore.setActiveStep(1);

  // 保存搜索参数到store
  bookingStore.setSearchParams({
    from: from.value,
    to: to.value,
    date: date.value,
  });
});

const searchTrains = async () => {
  if (!fromStation.value || !toStation.value || !date.value) {
    ElMessage.warning("Please fill in all search fields");
    return;
  }

  // 更新URL参数
  router.push({
    path: "/trains/timetable",
    query: {
      from: fromStation.value.stationCode,
      to: toStation.value.stationCode,
      date: date.value,
    },
  });

  loading.value = true;
  try {
    const response = await getTicketList({
      fromStationCode: fromStation.value.stationCode,
      toStationCode: toStation.value.stationCode,
      fromDate: date.value,
      isStudent: false,
    });

    // 转换API响应以匹配UI格式
    trains.value = response.data.map((train) => {
      // 处理座位信息
      const seats = [];
      if (train.swzPrice) {
        seats.push({
          type: "Business Class",
          price: train.swzPrice,
          status: train.swzNum === "有" ? "Available" : train.swzNum === "0" ? "Sold out" : `${train.swzNum} left`,
          amenities: ["wifi", "power", "tv", "meal"],
        });
      }
      if (train.ydzPrice) {
        seats.push({
          type: "First Class",
          price: train.ydzPrice,
          status: train.ydzNum === "有" ? "Available" : train.ydzNum === "0" ? "Sold out" : `${train.ydzNum} left`,
          amenities: ["wifi", "power"],
        });
      }
      if (train.edzPrice) {
        seats.push({
          type: "Second Class",
          price: train.edzPrice,
          status: train.edzNum === "有" ? "Available" : train.edzNum === "0" ? "Sold out" : `${train.edzNum} left`,
          amenities: ["wifi", "power"],
        });
      }

      // 查找出发和到达站的拼音名称
      const fromStationObj = cities.value.find((c) => c.stationCode === train.fromStation);
      const toStationObj = cities.value.find((c) => c.stationCode === train.toStation);

      return {
        id: train.trainNo,
        number: train.trainCode,
        type: train.trainType === "G" ? "High-speed G" : train.trainType === "D" ? "High-speed D" : "Normal K",
        departTime: train.fromTime,
        departStation: fromStationObj ? fromStationObj.label : train.fromStation,
        duration: train.runTime,
        arrivalTime: train.toTime,
        arrivalStation: toStationObj ? toStationObj.label : train.toStation,
        expanded: false,
        canBook: train.canBook,
        seats: seats,
        minPrice: seats.length > 0 ? Math.min(...seats.map((s) => s.price)) : null,
      };
    });

    // 应用筛选条件
    if (trainType.value) {
      trains.value = trains.value.filter((train) => train.number.startsWith(trainType.value));
    }

    if (departTime.value) {
      trains.value = trains.value.filter((train) => {
        const hour = parseInt(train.departTime.split(":")[0]);
        switch (departTime.value) {
          case "morning":
            return hour >= 6 && hour < 12;
          case "afternoon":
            return hour >= 12 && hour < 18;
          case "evening":
            return hour >= 18 || hour < 6;
          default:
            return true;
        }
      });
    }

    if (departStation.value) {
      trains.value = trains.value.filter((train) => train.departStation.toLowerCase().includes(departStation.value.toLowerCase()));
    }
  } catch (error) {
    console.error("Error fetching trains:", error);
    ElMessage.error("Failed to fetch train schedules. Please try again.");
  } finally {
    loading.value = false;
  }
};

// 添加对筛选条件的监听
watch([trainType, departTime, departStation], () => {
  if (trains.value.length > 0) {
    searchTrains();
  }
});

const handleSelect = (item) => {
  const activeElement = document.activeElement;
  if (activeElement.id === "from-search") {
    fromStation.value = item;
    from.value = item.pingYin;
  } else if (activeElement.id === "to-search") {
    toStation.value = item;
    to.value = item.pingYin;
  }
};

const swapLocations = () => {
  const tempValue = from.value;
  from.value = to.value;
  to.value = tempValue;

  const tempStation = { ...fromStation.value };
  fromStation.value = { ...toStation.value };
  toStation.value = tempStation;
};

const expandDetails = (train, event) => {
  // If the event is from a click on the close button, don't toggle
  if (event && event.target.closest('.custom-close-button')) {
    return;
  }
  
  // Close any other expanded trains first
  trains.value.forEach(t => {
    if (t.id !== train.id) {
      t.expanded = false;
    }
  });
  
  // Toggle the selected train
  train.expanded = !train.expanded;
  
  // Set the selected train for seat selection
  if (train.expanded) {
    selectedTrain.value = train;
    selectedSeatIndex.value = 1; // Default to First Class if available
    currentImageIndex.value = 0; // Reset image index
  }
};

const selectSeat = (index) => {
  selectedSeatIndex.value = index;
  currentImageIndex.value = 0; // Reset image index when changing seat type
};

const nextSeatImage = () => {
  if (!selectedTrain.value || !selectedTrain.value.seats) return;

  const seat = selectedTrain.value.seats[selectedSeatIndex.value];
  const images = seatImageMap[seat.type] || [];
  if (images.length > 1) {
    currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
  }
};

const prevSeatImage = () => {
  if (!selectedTrain.value || !selectedTrain.value.seats) return;

  const seat = selectedTrain.value.seats[selectedSeatIndex.value];
  const images = seatImageMap[seat.type] || [];
  if (images.length > 1) {
    currentImageIndex.value = (currentImageIndex.value - 1 + images.length) % images.length;
  }
};

const highlightMatch = (text, query) => {
  if (!query) return text;

  // 转换为小写进行匹配
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // 如果没有匹配到，直接返回原文本
  const index = lowerText.indexOf(lowerQuery);
  if (index === -1) return text;

  // 保持原文本的大小写，只添加高亮样式
  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);
  return before + `<span class="highlight">${match}</span>` + after;
};

// 计算城市与搜索字符串的匹配度分数
const calculateMatchScore = (city, searchStr) => {
  let score = 0;

  // 如果城市名称以搜索字符串开头，给予更高分数
  if (city.name.toLowerCase().startsWith(searchStr)) {
    score += 100;
  } else if (city.name.toLowerCase().includes(searchStr)) {
    score += 50;
  }

  // 如果拼音以搜索字符串开头，给予更高分数
  if (city.value.toLowerCase().startsWith(searchStr)) {
    score += 80;
  } else if (city.value.toLowerCase().includes(searchStr)) {
    score += 40;
  }

  // 如果拼音简写匹配，给予一定分数
  if (city.pingYinShort && city.pingYinShort.toLowerCase().includes(searchStr)) {
    score += 30;
  }

  // 名称越短，分数越高（但权重较低）
  score += Math.max(0, 10 - city.name.length);

  return score;
};

const querySearch = (queryString, cb) => {
  searchQuery.value = queryString;
  if (!queryString) {
    const suggestions = [];

    // Add hot cities section
    if (localHotCities.value.length > 0) {
      suggestions.push({
        label: "Hot Cities",
        cities: localHotCities.value.map((city) => ({
          ...city,
          pingYin: city.value.charAt(0).toUpperCase() + city.value.slice(1).toLowerCase(),
          displayPinyin: city.value.charAt(0).toUpperCase() + city.value.slice(1).toLowerCase(),
        })),
      });
    }

    // Group other cities by pinyin first letter
    const groupedCities = {};
    cities.value.forEach((city) => {
      const firstLetter = city.value[0].toUpperCase();
      if (!groupedCities[firstLetter]) {
        groupedCities[firstLetter] = [];
      }
      const formattedPinyin = city.value.charAt(0).toUpperCase() + city.value.slice(1).toLowerCase();
      groupedCities[firstLetter].push({
        ...city,
        pingYin: formattedPinyin,
        displayPinyin: formattedPinyin,
      });
    });

    // Add grouped cities
    Object.entries(groupedCities)
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([letter, cities]) => {
        suggestions.push({
          label: letter,
          cities: cities,
        });
      });

    cb(suggestions);
  } else {
    const searchStr = queryString.toLowerCase();
    const results = cities.value
      .filter((city) => {
        return city.name.toLowerCase().includes(searchStr) || city.value.toLowerCase().includes(searchStr) || (city.pingYinShort && city.pingYinShort.toLowerCase().includes(searchStr));
      })
      .map((city) => {
        const formattedPinyin = city.value.charAt(0).toUpperCase() + city.value.slice(1).toLowerCase();
        return {
          ...city,
          pingYin: formattedPinyin,
          displayPinyin: highlightMatch(formattedPinyin, queryString),
          // 计算匹配度分数：精确匹配得分高，名称长度短的得分高
          matchScore: calculateMatchScore(city, searchStr),
        };
      })
      .sort((a, b) => {
        // 首先按照匹配度分数排序（降序）
        if (b.matchScore !== a.matchScore) {
          return b.matchScore - a.matchScore;
        }
        // 其次按照名称长度排序（升序，短名称优先）
        if (a.name.length !== b.name.length) {
          return a.name.length - b.name.length;
        }
        // 最后按照字典序排序
        return a.value.localeCompare(b.value);
      });

    cb([{ label: "Search Results", cities: results }]);
  }
};

// Watch for route query changes
watch(
  () => route.query,
  (newQuery) => {
    const shouldSearch = Object.keys(newQuery).length > 0;

    if (newQuery.from) {
      const station = cities.value.find((c) => c.stationCode === newQuery.from);
      if (station) {
        fromStation.value = station;
        from.value = station.value;
      }
    }

    if (newQuery.to) {
      const station = cities.value.find((c) => c.stationCode === newQuery.to);
      if (station) {
        toStation.value = station;
        to.value = station.value;
      }
    }

    if (newQuery.date) {
      try {
        // 将日期字符串解析为 YYYY-MM-DD 格式
        const parsedDate = new Date(newQuery.date);
        if (!isNaN(parsedDate.getTime())) {
          date.value = parsedDate.toISOString().split("T")[0];
        } else {
          date.value = new Date().toISOString().split("T")[0];
        }
      } catch {
        date.value = new Date().toISOString().split("T")[0];
      }
    }

    if (shouldSearch && fromStation.value && toStation.value && date.value) {
      searchTrains();
    }
  },
  { immediate: true }
);

const dateShortcuts = [
  {
    text: "Today",
    value: new Date(),
  },
  {
    text: "Tomorrow",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() + 3600 * 1000 * 24);
      return date;
    },
  },
  {
    text: "A week later",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
      return date;
    },
  },
];

const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7 || time.getTime() > Date.now() + 8.64e7 * 30; // 禁用今天之前和30天后的日期
};

// 转换价格从人民币到当前选择的货币
const convertPrice = (cnyPrice) => {
  if (!exchangeRates.value || !cnyPrice) return 0;
  const targetCurrency = currency.value;
  const rate = exchangeRates.value[targetCurrency];
  if (!rate) return 0;
  
  const convertedPrice = parseFloat(cnyPrice) * rate;
  return Math.ceil(convertedPrice); // 向上取整到整数
};

// 格式化日期，例如 '20 March'
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return format(date, "dd MMMM");
  } catch (e) {
    console.error("Error formatting date:", e);
    return dateString;
  }
};

// 跳转到创建订单页面
const goToCreateOrder = (train, seat) => {
  // 更新订单流程参数并设置下一步
  const bookingStore = useBookingStore();
  bookingStore.setSearchParams({
    from: from.value,
    to: to.value,
    date: date.value,
    selectedTrain: train,
    selectedSeat: seat,
  });

  // 更新激活步骤为"乘客信息"
  bookingStore.setActiveStep(2);

  console.log("train, seat", train, seat);
  router.push({
    name: "PassengerInfo",
    query: {
      trainId: train.id,
      trainNo: train.number,
      from: train.departStation,
      to: train.arrivalStation,
      date: date.value,
      seatType: seat.type,
      price: seat.price,
      departTime: train.departTime,
      arriveTime: train.arrivalTime,
      duration: train.duration,
    },
  });
};
</script>

<style scoped>
.search-results {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
  width: 70%;
  min-width: 800px;
  margin: 0 auto;
  position: relative;
}

.search-header {
  background: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.search-params {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 16px;
  max-width: 1200px;
  margin-left: 0;
  width: 100%;
}

.param {
  flex: 1;
  position: relative;
  min-width: 20px;
  max-width: calc(33.33% - 8px);
  width: calc(33.33% - 8px);

  :deep(.el-autocomplete) {
    display: block;
    width: 100%;
  }

  :deep(.el-input) {
    width: 100%;
  }

  :deep(.el-input__wrapper) {
    width: 100%;
    box-sizing: border-box;
  }

  :deep(.el-autocomplete-suggestion) {
    width: 100% !important;
    min-width: unset !important;
    box-sizing: border-box;
  }

  :deep(.el-popper) {
    width: 100% !important;
    min-width: unset !important;
  }
}

.exchange-button {
  display: flex;
  align-items: flex-end;
  padding-bottom: 8px;
  flex: 0 0 auto;
  margin: 0 -6px;
}

.search-btn {
  height: 40px;
  padding: 0 20px;
  font-weight: normal;
  border-radius: 4px;
  flex: 0 0 auto;
  margin-left: auto;
}

:deep(.city-autocomplete) {
  width: 100% !important;
  min-width: unset !important;

  .el-autocomplete-suggestion__wrap {
    padding: 0;
    max-height: 300px;
  }

  .el-scrollbar__view {
    padding: 0;
  }

  .suggestion-list {
    max-height: 200px;
    overflow-y: auto;
  }
}

.full-width {
  width: 100%;
}

.suggestion-group {
  padding: 8px 0;
}

.suggestion-group-label {
  padding: 0 12px;
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.suggestion-list {
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-item:hover {
  background-color: #f5f7fa;
}

:deep(.highlight) {
  font-weight: bold !important;
  text-decoration: underline !important;
}

.filters {
  display: flex;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
  gap: 12px;
  max-width: 1200px;
  width: 100%;
  margin-left: 0;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: calc(33.33% - 8px);
  width: calc(33.33% - 8px);
}

.filter-group label {
  white-space: nowrap;
  font-size: 14px;
  color: #606266;
}

.filter-select {
  flex: 1;
  width: 100%;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-select .el-input__wrapper) {
  width: 100%;
  box-sizing: border-box;
}

:deep(.el-select .el-input__inner) {
  height: 30px;
  line-height: 30px;
  font-size: 13px;
}

:deep(.el-select__popper) {
  border-radius: 4px;
}

:deep(.el-select-dropdown__item) {
  font-size: 13px;
  padding: 0 12px;
  height: 32px;
  line-height: 32px;
}

.results-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: visible;
}

.list-header {
  display: flex;
  padding: 12px 24px;
  border-bottom: 1px solid #ebeef5;
  color: #909399;
  font-size: 14px;
}

/* Train card styles to match the UI in the image */
.train-card {
  background: white;
  border-radius: 0;
  margin-bottom: 0;
  overflow: hidden;
  box-shadow: none;
  border: 1px solid #e4e7ed;
  border-bottom: 3px solid #e4e7ed;
  transition: all 0.3s ease;
  position: relative;
}

.train-card.expanded {
  width: 112%;
  margin-left: -6%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  z-index: 5;
  border-color: #409eff;
  border-width: 1px;
  border-bottom-width: 3px;
  border-radius: 8px 8px 0 0;
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
}

.train-card:first-child {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.train-card:last-child {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-bottom: none;
}

.train-date {
  padding: 6px 0;
  font-size: 13px;
  color: #909399;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-top: 4px;
  font-style: italic;
}

.train-item {
  display: flex;
  padding: 20px;
  position: relative;
}

.col {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.departure-section,
.arrival-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.connection-section {
  flex: 0.8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 10px;
}

.time-large {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.station {
  font-size: 14px;
  color: #606266;
  margin-top: 6px;
}

.connection-line {
  height: 2px;
  background: #dcdfe6;
  position: relative;
  width: 100%;
  margin: 10px 0;
}

.distance {
  font-size: 13px;
  color: #909399;
  margin-bottom: 6px;
  text-align: center;
}

.connection-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #dcdfe6;
  top: -3px;
}

.connection-dot.start {
  left: 0;
}

.connection-dot.end {
  right: 0;
}

.train-info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20px;
  border-left: 2px solid #e4e7ed;
}

.train-type-tag {
  display: inline-block;
  background-color: #ffc107;
  color: #212121;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 6px;
  width: fit-content;
}

.train-number {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
}

.price-section-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 20px;
  border-left: 2px solid #e4e7ed;
}

.action-column {
  flex: 0.8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-left: 20px;
  border-left: 2px solid #e4e7ed;
}

.from-price {
  font-size: 14px;
  color: #606266;
}

.price-value {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
}

.passenger-price {
  font-size: 12px;
  color: #909399;
  margin: 4px 0 10px;
}

.action-btn {
  min-width: 120px;
  transition: all 0.3s ease;
}

.select-seats-btn {
  background-color: #409eff;
  border-color: #409eff;
}

.cancel-btn {
  background-color: #f56c6c;
  border-color: #f56c6c;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(245, 108, 108, 0.3);
}

.cancel-btn:hover {
  background-color: #e64242 !important;
  border-color: #e64242 !important;
  box-shadow: 0 6px 16px rgba(245, 108, 108, 0.4);
  transform: translateY(-2px);
}

.train-details {
  margin: 0;
  padding: 16px 24px;
  background: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
}

.seat-detail {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.seat-detail:last-child {
  margin-bottom: 0;
  border-bottom: none;
}

.seat-info {
  flex: 1;
}

.seat-type {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.amenities {
  display: flex;
  gap: 8px;
}

.amenity-icon {
  width: 20px;
  height: 20px;
  opacity: 0.7;
}

.seat-status {
  flex: 1;
  text-align: center;
  color: #909399;
  font-size: 14px;
  text-transform: uppercase;
}

.seat-price {
  flex: 0.5;
  text-align: right;
  background: #ff4081;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
}

.currency {
  font-size: 12px;
  margin-right: 2px;
}

.amount {
  font-size: 16px;
}

/* Train Detail Dialog Styles */
:deep(.train-detail-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.train-detail-dialog .el-dialog__header) {
  padding: 12px 20px;
  background-color: #f5f5f5;
  margin-right: 0;
  text-align: center;
  font-weight: 500;
  color: #606266;
  border-bottom: 1px solid #e4e7ed;
}

:deep(.train-detail-dialog .el-dialog__body) {
  padding: 0;
}

:deep(.train-detail-dialog .el-dialog__headerbtn) {
  top: 12px;
}

.dialog-train-header {
  display: flex;
  padding: 20px;
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
}

.dialog-time-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.dialog-time-section:last-child {
  align-items: flex-end;
}

.dialog-time {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
}

.dialog-station {
  font-size: 14px;
  color: #606266;
  margin-top: 4px;
}

.dialog-journey-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.dialog-distance {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.dialog-arrow {
  font-size: 20px;
  color: #909399;
}

.dialog-train-info {
  padding: 15px 20px;
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-train-tag {
  display: inline-block;
  background-color: #ffc107;
  color: #212121;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  width: fit-content;
}

.dialog-train-number {
  font-size: 14px;
  color: #606266;
  margin-left: 10px;
}

.dialog-passenger-info {
  font-size: 14px;
  color: #606266;
  text-align: right;
}

.dialog-important-note {
  padding: 15px 20px;
  background-color: #fef0f0;
  border-radius: 4px;
  margin: 0 20px 20px;
  font-size: 14px;
  color: #f56c6c;
  line-height: 1.5;
  box-shadow: 0 2px 6px rgba(245, 108, 108, 0.1);
  border-left: 4px solid #f56c6c;
}

.dialog-tabs {
  display: flex;
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
  position: relative;
}

.dialog-tab {
  padding: 12px 20px;
  font-size: 14px;
  color: #909399;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.dialog-tab.active {
  color: #409eff;
  border-bottom-color: #409eff;
  font-weight: 500;
}

.dialog-info-icon {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #f4f4f5;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-style: italic;
  font-weight: bold;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  padding: 0 20px;
  width: 100%;
}

.dialog-seat-selection-layout {
  display: flex;
  flex-direction: row;
  background-color: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  margin: 20px 0;
  border: 1px solid #e4e7ed;
  max-width: 100%;
  width: 100%;
}

.dialog-seat-image-container {
  flex: 3;
  position: relative;
  background-color: #000;
  overflow: hidden;
  min-height: 400px;
  max-height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-seat-selection-panel {
  flex: 2;
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 0;
  overflow-y: auto;
  max-width: 40%;
}

.dialog-tabs {
  display: flex;
  border-bottom: 1px solid #e4e7ed;
  padding: 0;
  background-color: #f5f7fa;
  justify-content: space-between;
}

.dialog-tab {
  padding: 15px 20px;
  font-size: 16px;
  font-weight: 500;
  color: #606266;
  cursor: pointer;
  position: relative;
  text-align: center;
}

.dialog-tab:first-child {
  margin-left: 20px;
}

.dialog-tab:last-child {
  margin-right: 20px;
}

.dialog-tab.active {
  color: #303133;
  font-weight: 600;
}

.dialog-tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 90%;
  height: 2px;
  background-color: #002855;
}

.dialog-info-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f0f2f5;
  color: #909399;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-top: 15px;
  font-style: italic;
  font-weight: 600;
  cursor: pointer;
}



.dialog-seat-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
  max-height: 400px;
}

.dialog-seat-description {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 14px;
  line-height: 1.5;
  backdrop-filter: blur(3px);
}

.show-more-link {
  color: #ffc107;
  text-decoration: none;
  margin-left: 5px;
}

.dialog-image-navigation {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  transform: translateY(-50%);
  z-index: 10;
}

.nav-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.8);
}

.dialog-seat-options {
  padding: 15px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 400px;
  overflow-y: auto;
}

.dialog-seat-option {
  display: flex;
  background-color: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  margin-bottom: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  justify-content: space-between;
  cursor: pointer;
  height: 120px;
  overflow: hidden;
}

.dialog-seat-option:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dialog-seat-option.selected {
  border-color: #002855;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.dialog-seat-info {
  flex: 1;
  padding: 12px 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.dialog-seat-type {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.dialog-seat-amenities {
  display: flex;
  gap: 12px;
}

.dialog-amenity-icon {
  width: 24px;
  height: 24px;
  opacity: 0.8;
}

.dialog-seat-price-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  padding: 5px 15px;
  transition: all 0.3s ease;
}

.selected-price-section {
  background-color: #002855;
  color: white;
}

.dialog-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 0;
}

.dialog-price-currency {
  font-size: 18px;
  font-weight: 500;
  color: #303133;
  margin-right: 2px;
}

.selected .dialog-price-currency {
  color: white;
}

.dialog-price-amount {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
}

.selected .dialog-price-amount {
  color: white;
}

.dialog-per-seat {
  font-size: 14px;
  color: #909399;
  margin-top: 0;
  margin-bottom: 6px;
}

.selected .dialog-per-seat {
  color: white;
}

.dialog-book-btn {
  width: 100%;
  margin-top: 4px;
  background-color: white;
  color: #002855;
  border-color: white;
  font-weight: 600;
  border-radius: 4px;
  padding: 8px 15px;
  height: auto;
}

.dialog-footer {
  padding: 20px;
  background-color: white;
  border-top: 1px solid #e4e7ed;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.dialog-total {
  font-size: 14px;
  color: #606266;
}

.dialog-total-price {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
}

.dialog-continue-btn {
  min-width: 120px;
}

@media (max-width: 768px) {
  .search-results {
    width: 95%;
    padding: 16px;
  }

  .search-params,
  .filters {
    flex-direction: column;
  }

  .swap-icon {
    right: 8px;
    bottom: 12px;
  }

  .train-item {
    flex-wrap: wrap;
  }

  .col {
    flex: 50% !important;
    margin-bottom: 16px;
  }

  .col.action {
    flex: 100% !important;
    align-items: stretch;
  }

  .dialog-train-header {
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }

  .dialog-time-section:last-child {
    align-items: flex-start;
  }

  .dialog-seat-option {
    flex-direction: column;
    gap: 15px;
  }

  .dialog-seat-price-section {
    align-items: flex-start;
  }

  .dialog-footer {
    flex-direction: column;
    gap: 15px;
  }

  .dialog-continue-btn {
    width: 100%;
  }
}

/* Inline train details styles */
.inline-train-details {
  border-top: 0;
  position: relative;
  overflow: visible;
  transition: all 0.3s ease;
  margin-bottom: 0;
  width: 94%;
  margin-left: auto;
  margin-right: auto;
  z-index: 4;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Close button styles removed */
</style>
