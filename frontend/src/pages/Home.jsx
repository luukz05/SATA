import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  Button,
  TouchableOpacity,
} from "react-native";
import { Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";

export default function Home() {
  const [weather, setWeather] = useState(null);
  const [flood, setFlood] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [currentTime, setCurrentTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [riscoHoje, setRiscoHoje] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const MARGEM_DE_RISCO = 1.15; // 130% da média
  const gradients = {
    clear: ["#4a90e2", "#50a0f0"],
    partlyCloudy: ["#607d8b", "#90a4ae"],
    fog: ["#9e9e9e", "#b0b0b0"],
    lightRain: ["#90a4ae", "#78909c"],
    heavyRain: ["#78909c", "#455a64"],
    snow: ["#737575", "#3e6a70"],
    thunderstorm: ["#66547a", "#383138"],
    storm: ["#37474f", "#3c3b50"],
    default: ["#607d8b", "#78909c"],
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ title: "", message: "" });
  const [loadingM, setLoadingM] = useState(false);
  const ultimoIdExibidoRef = useRef(0);

  const latestCode =
    weather?.daily?.weather_code?.[weather?.daily?.weather_code.length - 1];

  const backgroundColors = useMemo(() => {
    if (latestCode === undefined) return gradients.default;
    if (latestCode === 0) return gradients.clear;
    if ([1, 2, 3].includes(latestCode)) return gradients.partlyCloudy;
    if ([45, 48].includes(latestCode)) return gradients.fog;
    if ([51, 53, 55, 80, 81, 82].includes(latestCode))
      return gradients.lightRain;
    if ([56, 57, 61, 63, 65].includes(latestCode)) return gradients.heavyRain;
    if ([66, 67].includes(latestCode)) return gradients.fog;
    if ([71, 73, 75].includes(latestCode)) return gradients.storm;
    if ([77, 85, 86].includes(latestCode)) return gradients.snow;
    if (latestCode === 95) return gradients.thunderstorm;
    if ([96, 99].includes(latestCode)) return gradients.storm;
    return gradients.default;
  }, [latestCode]);

  const fetchMessage = async () => {
    try {
      const response = await axios.get(
        "https://e5bf-2804-1b1-fa00-f190-2d24-ccc7-3f7e-f1f0.ngrok-free.app/"
      );

      const { id, mensagem, data } = response.data;

      if (id > ultimoIdExibidoRef.current) {
        setModalData({
          mensagem,
          data: new Date(data).toLocaleString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        });
        setModalVisible(true);
        ultimoIdExibidoRef.current = id; // atualiza o ID corretamente sem depender do ciclo de render
      }
    } catch (error) {
      console.error("Erro ao buscar mensagem do backend:", error);
    }
  };

  const fetchWeather = async () => {
    try {
      const res = await axios.get("https://api.open-meteo.com/v1/forecast", {
        params: {
          latitude: -23.5017,
          longitude: -47.4581,
          daily:
            "precipitation_probability_max,precipitation_hours,precipitation_sum,weather_code",
          hourly:
            "rain,visibility,precipitation_probability,precipitation,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm",
          current: "temperature_2m,precipitation",
          timezone: "America/Sao_Paulo",
          forecast_days: 1,
        },
      });
      setWeather(res.data);
      setLastUpdate(new Date(res.data.current.time).toLocaleString("pt-BR"));
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar dados do tempo.");
      console.error("Erro ao buscar clima:", error);
    }
  };

  const fetchFlood = async () => {
    try {
      const res = await axios.get("https://flood-api.open-meteo.com/v1/flood", {
        params: {
          latitude: -23.5017,
          longitude: -47.4581,
          daily: "river_discharge,river_discharge_max,river_discharge_mean",
          forecast_days: 31,
        },
      });
      setFlood(res.data);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar dados de inundação.");
      console.error("Erro ao buscar inundação:", error);
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      await fetchWeather();
      await fetchFlood();
      await fetchMessage();
      setLoading(false);
    };

    carregarDados();

    const atualizarHora = () => {
      const agora = new Date();
      setCurrentTime(
        agora.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    atualizarHora();
    const intervaloHora = setInterval(atualizarHora, 60000);

    // Intervalo para polling do fetchMessage a cada 30 segundos
    const intervaloMensagem = setInterval(fetchMessage, 5000);

    return () => {
      clearInterval(intervaloHora);
      clearInterval(intervaloMensagem);
    };
  }, []);

  const iconName = useMemo(() => {
    if (latestCode === undefined) return "help-circle-outline";
    if (latestCode === 0) return "sunny";
    if ([1, 2, 3].includes(latestCode)) return "partly-sunny";
    if ([45, 48].includes(latestCode)) return "cloud-outline";
    if ([51, 53, 55].includes(latestCode)) return "rainy-outline";
    if ([56, 57].includes(latestCode)) return "snow-outline";
    if ([61, 63, 65, 80, 81, 82].includes(latestCode)) return "rainy";
    if ([66, 67, 71, 73, 75, 77, 85, 86].includes(latestCode)) return "snow";
    if (latestCode === 95) return "thunderstorm-outline";
    if ([96, 99].includes(latestCode)) return "thunderstorm";
    return "help-circle-outline";
  }, [latestCode]);

  const weatherName = useMemo(() => {
    if (latestCode === undefined) return "Desconhecido";
    if (latestCode === 0) return "Limpo";
    if ([1, 2, 3].includes(latestCode)) return "Parcialmente Limpo";
    if ([45, 48].includes(latestCode)) return "Nublado";
    if ([51, 53, 55].includes(latestCode)) return "Chuvoso";
    if ([56, 57].includes(latestCode)) return "Neve";
    if ([61, 63, 65, 80, 81, 82].includes(latestCode)) return "Chuvoso";
    if ([66, 67, 71, 73, 75, 77, 85, 86].includes(latestCode)) return "Neve";
    if (latestCode === 95) return "Tempestade";
    if ([96, 99].includes(latestCode)) return "Tempestade";
    return "Desconhecido";
  }, [latestCode]);

  const riverDischarge = flood?.daily?.river_discharge || [];
  const riverDischargeMax = flood?.daily?.river_discharge_max || [];
  const riverDischargeMean = flood?.daily?.river_discharge_mean || [];
  const dates = flood?.daily?.time || [];

  const lineData = (data) =>
    dates.map((date, index) => ({
      value: data[index],
      label: `${date.slice(8, 10)}/${date.slice(5, 7)}`,
    }));

  const diasDeRisco = useMemo(() => {
    return riverDischarge
      .map((valor, i) => {
        if (valor > riverDischargeMean[i] * MARGEM_DE_RISCO) {
          const data = new Date(dates[i]);
          const diaMes = `${String(data.getDate()).padStart(2, "0")}/${String(
            data.getMonth() + 1
          ).padStart(2, "0")}`;
          return diaMes;
        }
        return null;
      })
      .filter(Boolean);
  }, [riverDischarge, riverDischargeMean, dates]);

  useEffect(() => {
    if (riverDischarge.length > 0 && riverDischargeMean.length > 0) {
      setRiscoHoje(riverDischarge[0] > riverDischargeMean[0] * MARGEM_DE_RISCO);
    }
  }, [riverDischarge, riverDischargeMean]);
  return (
    <LinearGradient colors={backgroundColors} className="flex-1">
      <SafeAreaView>
        <View className="p-4">
          {/* <Button title="Mostrar Modal do Backend" onPress={fetchMessage} /> */}
          {loading && <ActivityIndicator size="large" />}

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 10,
                  width: "80%",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  Alerta!
                </Text>
                <Text style={{ marginVertical: 10 }}>{modalData.mensagem}</Text>
                <Text style={{ marginVertical: 10 }}>{modalData.data}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={{ color: "blue" }}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View className="w-full items-start border-b-[1px] border-white pb-2">
            <Text className="text-3xl text-white">{currentTime}</Text>
            <Text className="text-5xl font-bold text-white">Sorocaba</Text>
            {lastUpdate && (
              <Text className="text-white text-xs mt-1">
                Atualizado: {lastUpdate}
              </Text>
            )}
          </View>

          {loading ? (
            <View className="flex items-center justify-center mt-10 w-full">
              <ActivityIndicator size="large" color="#fff" />
              <Text className="text-white mt-3">Carregando dados...</Text>
            </View>
          ) : (
            <>
              <View className="flex flex-row items-center justify-center py-5 gap-6">
                <Ionicons name={iconName} size={64} color="white" />
                <Text className="text-8xl font-extrabold text-white">
                  {Math.round(weather?.current?.temperature_2m)}°
                </Text>
              </View>
              <Text className="text-xl font-bold text-white text-center">
                {weatherName}
              </Text>

              <View className="mt-6">
                <Text className="text-white text-lg font-semibold border-b border-white pb-1">
                  Detalhes de hoje
                </Text>
                <View className="grid grid-cols-2 gap-4 mt-3">
                  {[
                    {
                      label: "Precipitação Atual",
                      value: `${weather?.current?.precipitation} mm`,
                    },
                    {
                      label: "Prob. Máxima de Chuva",
                      value: `${weather?.daily?.precipitation_probability_max?.[0]}%`,
                    },
                    {
                      label: "Horas com Chuva",
                      value: `${weather?.daily?.precipitation_hours?.[0]}h`,
                    },
                    {
                      label: "Precipitação Total",
                      value: `${weather?.daily?.precipitation_sum?.[0]} mm`,
                    },
                  ].map(({ label, value }, index) => (
                    <View
                      key={index}
                      className="bg-white/10 rounded-xl p-3 flex-row justify-between"
                    >
                      <Text className="text-white">{label}</Text>
                      <Text className="text-white font-bold">{value}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className="mt-6">
                <Text className="text-white text-lg font-semibold border-b border-white pb-1 mb-2">
                  Tendência da vazão do Rio Sorocaba
                </Text>
                {riverDischarge.length > 0 ? (
                  <View>
                    <Text className="text-white mb-2">Vazão em m³/s</Text>
                    <LineChart
                      height={250}
                      width={screenWidth - 40}
                      showVerticalLines
                      verticalLinesColor="#ffffff33"
                      spacing={40}
                      initialSpacing={5}
                      maxValue={130}
                      yAxisColor="#ffffff"
                      yAxisTextStyle={{ color: "white", fontSize: 10 }}
                      xAxisLabelTextStyle={{
                        color: "white",
                        fontSize: 10,
                        transform: [{ rotate: "45deg" }],
                        marginTop: 8,
                        textAlign: "center",
                      }}
                      xAxisThickness={1}
                      xAxisColor="white"
                      textColor1="white"
                      textColor2="white"
                      textColor3="white"
                      data={lineData(riverDischarge)}
                      data2={lineData(riverDischargeMax)}
                      data3={lineData(riverDischargeMean)}
                      color1="cyan"
                      color2="blue"
                      color3="red"
                    />
                    <View className="mt-8 m-auto">
                      <View className="flex-row items-center gap-3">
                        <View className="flex-col items-center gap-1">
                          <View className="flex-row items-center gap-1">
                            <View className="w-5 h-5 bg-cyan-400" />
                            <Text className="text-white text-xs">
                              Vazão Atual Prevista
                            </Text>
                          </View>
                          <Text className="text-white">
                            {riverDischarge[0]} m³/s
                          </Text>
                        </View>
                        <View className="flex-col items-center gap-1">
                          <View className="flex-row items-center gap-1">
                            <View className="w-5 h-5 bg-blue-800" />
                            <Text className="text-white text-xs">
                              Vazão Máxima Prevista
                            </Text>
                          </View>
                          <Text className="text-white">
                            {riverDischargeMax[0]} m³/s
                          </Text>
                        </View>
                        <View className="flex-col items-center gap-1">
                          <View className="flex-row items-center gap-1">
                            <View className="w-5 h-5 bg-red-500" />
                            <Text className="text-white text-xs">
                              Vazão Media Prevista
                            </Text>
                          </View>
                          <Text className="text-white">
                            {riverDischargeMean[0]} m³/s
                          </Text>
                        </View>
                      </View>
                    </View>
                    {riscoHoje ? (
                      <View className="mt-6">
                        <Text className="text-white text-lg font-semibold border-b border-white pb-1 mb-2">
                          Aviso de Enchentes
                        </Text>
                        <View className="bg-red-600/70 rounded-lg px-4 py-2 w-full">
                          <Text className="text-white font-bold text-center">
                            ⚠️ Risco de enchentes hoje
                          </Text>
                          <Text className="text-white text-sm text-center mt-1">
                            Há previsão de chuvas intensas e possível elevação
                            do nível do Rio Sorocaba. Fique atento a
                            atualizações e siga orientações da Defesa Civil.
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View className="mt-6">
                        <Text className="text-white text-lg font-semibold border-b border-white pb-1 mb-2">
                          Aviso de Enchentes
                        </Text>
                        <View className="bg-green-600/70 rounded-lg px-4 py-2 w-full">
                          <Text className="text-white font-bold text-center">
                            ✅ Sem risco de enchentes hoje
                          </Text>
                          <Text className="text-white text-sm text-center mt-1">
                            As condições climáticas estão estáveis, sem previsão
                            de chuvas intensas ou aumento significativo na vazão
                            do Rio Sorocaba.
                          </Text>
                        </View>
                      </View>
                    )}

                    {diasDeRisco.length > 0 && (
                      <>
                        <View className="mt-3 bg-slate-400/70 rounded-lg px-4 py-2 w-full">
                          <Text className="text-white font-bold text-center">
                            ⚠️ Datas Previstas de Enchentes
                          </Text>
                          <Text className="text-white text-sm text-center mt-1">
                            Previsão de vazão acima da média nas seguintes
                            datas:
                          </Text>
                          <View className="flex-row gap-2 flex-wrap justify-center mt-2">
                            {diasDeRisco.map((data, i) => (
                              <Text
                                key={i}
                                className="text-white bg-white/15 w-20  text-center rounded-lg p-1 mx-2 mb-1 text-s"
                              >
                                {data}
                              </Text>
                            ))}
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                ) : (
                  <Text className="text-white">
                    Dados de vazão indisponíveis.
                  </Text>
                )}
              </View>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
